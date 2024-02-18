import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import handleError from "../error.js";
import CryptoJS from "crypto-js";

// get user
const getUser = async (req, res, next) => {
  try {
    // search for user by username
    const user = await User.findOne({ username: req.params.username });
    // if user does not exist
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

// update user
const updateUser = async (req, res, next) => {
  // check if user is updating their own account
  if (req.params.username === req.user.username) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: req.params.username },
        { $set: req.body },
        { new: true }
      );
      const { password, ...info } = updatedUser._doc;

      res.status(200).json(info);
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your account!"));
  }
};

// Update Password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.params.username;

  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json("User not found.");
    }

    // Decrypt the stored password
    const decryptedCurrentPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    // Compare provided current password with decrypted password
    if (decryptedCurrentPassword !== currentPassword) {
      return res.status(400).json("Current password is incorrect.");
    }

    // Encrypt the new password
    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.SECRET_KEY
    ).toString();

    // Update the user's password with the new encrypted password
    user.password = encryptedNewPassword;
    await user.save();

    res.status(200).json("Password updated successfully.");
  } catch (err) {
    res.status(500).json("Internal server error.");
  }
};

const deleteUser = async (req, res, next) => {
  // check if user is updating their own account
  if (req.params.username === req.user.username) {
    try {
      // delete user and all their tweets
      await User.findOneAndDelete({ username: req.params.username });
      await Tweet.deleteMany({ username: req.params.username });

      res.status(200).json({ message: "User successfully deleted!" });
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only delete your account!"));
  }
};

// follow user
const followUser = async (req, res, next) => {
  try {
    // get user to be followed
    const userToBeFollowed = await User.findOne({
      username: req.params.username,
    });
    if (!userToBeFollowed) {
      return res.status(404).json({ error: "User to be followed not found!" });
    }

    // get current user
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found!" });
    }

    // follow logic
    if (!userToBeFollowed.followers.includes(currentUser.username)) {
      await userToBeFollowed.updateOne({
        $push: { followers: currentUser.username },
      });
      await currentUser.updateOne({
        $push: { following: userToBeFollowed.username },
      });
    } else {
      return res.status(403).json({ error: "You already follow this user!" });
    }

    // confirm user has been followed
    res.status(200).json("You are now following this user!");
  } catch (err) {
    // handle database query errors
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// unfollow user
const unfollowUser = async (req, res, next) => {
  try {
    // get user to be unfollowed
    const userToBeUnfollowed = await User.findOne({
      username: req.params.username,
    });
    if (!userToBeUnfollowed) {
      return res
        .status(404)
        .json({ error: "User to be unfollowed not found!" });
    }

    // get current user
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found!" });
    }

    // unfollow logic
    if (userToBeUnfollowed.followers.includes(currentUser.username)) {
      await userToBeUnfollowed.updateOne({
        $pull: { followers: currentUser.username },
      });
      await currentUser.updateOne({
        $pull: { following: userToBeUnfollowed.username },
      });
    } else {
      return res.status(403).json({ error: "You do not follow this user!" });
    }

    // confirm user has been unfollowed
    res.status(200).json("You are no longer following this user!");
  } catch (err) {
    // handle database query errors
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// who to follow
const whoToFollow = async (req, res, next) => {
  try {
    // Get 5 users with the most followers
    const users = await User.find().sort({ followers: -1 }).limit(5);

    // If no users are found
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Users not found!" });
    }

    // Remove passwords and emails from each user
    const sanitizedUsers = users.map((user) => {
      const { password, email, ...userInfo } = user._doc;
      return userInfo;
    });

    res.status(200).json(sanitizedUsers);
  } catch (err) {
    next(err);
  }
};

// get liked tweets for a user
const getLikedTweets = async (req, res, next) => {
  try {
    // get user's liked tweets
    const likedTweets = await Tweet.find({
      likes: { $in: [req.params.username] },
    }).sort({ createdAt: -1 });
    // return bookmarked tweets
    res.status(200).json(likedTweets);
  } catch (err) {
    return next(handleError(500, err.message));
  }
};

// get user media
const getUserMedia = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ username: req.params.username });

    // Array to store all the media
    const allMedia = [];

    // Iterate over each tweet to extract media
    userTweets.forEach((tweet) => {
      if (tweet.media) {
        allMedia.push(tweet.media);
      }
    });

    // Return only the media array
    res.status(200).json(allMedia);
  } catch (err) {
    return next(handleError(500, "User not found!"));
  }
};


const searchUsers = async (req, res, next) => {
  try {
    // get users from the database
    const users = await User.find({
      username: { $regex: req.params.searchTerm, $options: "i" },
    });
    // return users
    res.status(200).json(users);
  } catch (err) {
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
  searchUsers
};
