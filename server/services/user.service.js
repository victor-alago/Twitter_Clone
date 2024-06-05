import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import handleError from "../error.js";
import CryptoJS from "crypto-js";
import { neo4jDriver } from "../db.js"; // Import Neo4j driver

// Get user
const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  if (req.params.username === req.user.username) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: req.params.username },
        { $set: req.body },
        { new: true }
      );
      const { password, ...info } = updatedUser._doc;

      // Update user in Neo4j
      const session = neo4jDriver.session();
      try {
        await session.run(
          'MATCH (u:User {id: $id}) SET u.firstname = $firstname, u.lastname = $lastname, u.username = $username, u.email = $email',
          { id: updatedUser._id.toString(), ...req.body }
        );
      } finally {
        await session.close();
      }

      res.status(200).json(info);
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your account!"));
  }
};

// Update password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.params.username;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json("User not found.");
    }

    // Decrypt the stored password
    const decryptedCurrentPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedCurrentPassword !== currentPassword) {
      return res.status(400).json("Current password is incorrect.");
    }

    // Encrypt the new password
    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.SECRET_KEY
    ).toString();

    user.password = encryptedNewPassword;
    await user.save();

    // Update password in Neo4j (if needed)
    const session = neo4jDriver.session();
    try {
      await session.run(
        'MATCH (u:User {id: $id}) SET u.password = $password',
        { id: user._id.toString(), password: encryptedNewPassword }
      );
    } finally {
      await session.close();
    }

    res.status(200).json("Password updated successfully.");
  } catch (err) {
    res.status(500).json("Internal server error.");
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  if (req.params.username === req.user.username) {
    try {
      await User.findOneAndDelete({ username: req.params.username });
      await Tweet.deleteMany({ username: req.params.username });

      // Delete user from Neo4j
      const session = neo4jDriver.session();
      try {
        await session.run(
          'MATCH (u:User {id: $id}) DETACH DELETE u',
          { id: req.user._id.toString() }
        );
      } finally {
        await session.close();
      }

      res.status(200).json({ message: "User successfully deleted!" });
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only delete your account!"));
  }
};

// Follow user
const followUser = async (req, res, next) => {
  try {
    const userToBeFollowed = await User.findOne({ username: req.params.username });
    const currentUser = await User.findOne({ username: req.user.username });

    if (!userToBeFollowed || !currentUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (!userToBeFollowed.followers.includes(currentUser.username)) {
      // Update MongoDB
      await userToBeFollowed.updateOne({ $push: { followers: currentUser.username } });
      await currentUser.updateOne({ $push: { following: userToBeFollowed.username } });

      // Update Neo4j
      const session = neo4jDriver.session();
      try {
        await session.run(
          'MATCH (follower:User {username: $follower}), (followed:User {username: $followed}) MERGE (follower)-[:FOLLOWS]->(followed)',
          { follower: currentUser.username, followed: userToBeFollowed.username }
        );
      } finally {
        await session.close();
      }
    } else {
      return res.status(403).json({ error: "You already follow this user!" });
    }

    res.status(200).json("You are now following this user!");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Unfollow user
const unfollowUser = async (req, res, next) => {
  try {
    const userToBeUnfollowed = await User.findOne({ username: req.params.username });
    const currentUser = await User.findOne({ username: req.user.username });

    if (!userToBeUnfollowed || !currentUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (userToBeUnfollowed.followers.includes(currentUser.username)) {
      // Update MongoDB
      await userToBeUnfollowed.updateOne({ $pull: { followers: currentUser.username } });
      await currentUser.updateOne({ $pull: { following: userToBeUnfollowed.username } });

      // Update Neo4j
      const session = neo4jDriver.session();
      try {
        await session.run(
          'MATCH (follower:User {username: $follower})-[r:FOLLOWS]->(followed:User {username: $followed}) DELETE r',
          { follower: currentUser.username, followed: userToBeUnfollowed.username }
        );
      } finally {
        await session.close();
      }
    } else {
      return res.status(403).json({ error: "You do not follow this user!" });
    }

    res.status(200).json("You are no longer following this user!");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Who to follow
const whoToFollow = async (req, res, next) => {
  try {
    const users = await User.find().sort({ followers: -1 }).limit(5);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Users not found!" });
    }

    const sanitizedUsers = users.map((user) => {
      const { password, email, ...userInfo } = user._doc;
      return userInfo;
    });

    res.status(200).json(sanitizedUsers);
  } catch (err) {
    next(err);
  }
};

// Get liked tweets for a user
const getLikedTweets = async (req, res, next) => {
  try {
    const likedTweets = await Tweet.find({
      likes: { $in: [req.params.username] },
    }).sort({ createdAt: -1 });
    res.status(200).json(likedTweets);
  } catch (err) {
    return next(handleError(500, err.message));
  }
};

// Get user media
const getUserMedia = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ username: req.params.username });
    const allMedia = [];
    userTweets.forEach((tweet) => {
      if (tweet.media) {
        allMedia.push(tweet.media);
      }
    });
    res.status(200).json(allMedia);
  } catch (err) {
    return next(handleError(500, "User not found!"));
  }
};

// Search users
const searchUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.searchTerm, $options: "i" },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Get user followers
const getUserFollowers = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const sanitizedFollowers = user.followers.map((follower) => ({
      username: follower,
    }));

    res.status(200).json(sanitizedFollowers);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

export {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  whoToFollow,
  updatePassword,
  getLikedTweets,
  getUserMedia,
  searchUsers,
  getUserFollowers,
};
