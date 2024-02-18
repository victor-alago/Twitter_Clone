import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import handleError from "../error.js";

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

// search for users
const searchUsers = async (req, res, next) => {
  try {
    // search for users by username
    const users = await User.find({ username: { $regex: req.query.username } });
    // if no users are found
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Users not found!" });
    }
    // remove passwords and emails from each user
    const sanitizedUsers = users.map((user) => {
      const { password, email, ...userInfo } = user._doc;
      return userInfo;
    });
    res.status(200).json(sanitizedUsers);
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
    // Get 5 users with the most followers that the current user is not following
    const currentUser = await User.find({username: req.user.username});
    const usersNotFollowing = await User.find({
      username: { $nin: currentUser.following }, // Exclude users that the current user is already following
    }).sort({ followers: -1 })  ;

    // If no users are found
    if (!usersNotFollowing || usersNotFollowing.length === 0) {
      return res.status(404).json({ error: "Users not found!" });
    }

    // Remove passwords and emails from each user
    const sanitizedUsers = usersNotFollowing.map((user) => {
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

// // get comment tweets for a user
// const getCommentTweets = async (req, res, next) => {
//   try {
//     // get user's tweet replies
//     const repliedTweets = await Tweet.find({
//       comments: { $in: [req.params.username] },
//     }).sort({ createdAt: -1 });
//     // return bookmarked tweets
//     res.status(200).json(repliedTweets);
//   } catch (err) {
//     return next(handleError(500, err.message));
//   }
// };

// get bookmarked tweets for a user
const getBookmarkedTweets = async (req, res, next) => {
  try {
    // get user's bookmarked tweets
    const bookmarkedTweets = await Tweet.find({
      bookmarks: { $in: [req.user.username] },
    }).sort({ createdAt: -1 });
    // return bookmarked tweets
    res.status(200).json(bookmarkedTweets);
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
      userTweets.forEach(tweet => {
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
  

export {
  getUser,
  searchUsers,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  whoToFollow,
  getLikedTweets,
  getBookmarkedTweets,
  getUserMedia,
};
