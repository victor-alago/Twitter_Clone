import User from "../models/User.js";
import Tweet from "../models/tweet.js";
import handleError from "../error.js";

// get user
const getUser = async (req, res, next) => {
    try{
        // search for user by username
        const user = await User.findOne({username: req.params.username});
        // if user does not exist
        if (!user){
            return res.status(404).json({error: "User not found!"});
        }
        const {password, ...info} = user._doc;
        res.status(200).json(info);
    } catch(err){
        next(err);
    }
};

// update user
const updateUser = async (req, res, next) => {
    // check if user is updating their own account
    if (req.params.username === req.user.username){
        try{
            const updatedUser = await User.findOneAndUpdate(
                {username: req.params.username},
                {$set: req.body},
                {new: true}
            );
            const {password, ...info} = updatedUser._doc;

            res.status(200).json(info);

        } catch(err){
            next(err);
        }
    }
    else{
        return next(handleError(403, "You can only update your account!"));
    }
}

const deleteUser = async (req, res, next) => {
    // check if user is updating their own account
    if (req.params.username === req.user.username) {
        try {
            // delete user and all their tweets
            await User.findOneAndDelete({ username: req.params.username });
            await Tweet.deleteMany({ username: req.params.username });

            res.status(200).json({ message: "User successfully deleted!" });
        } catch(err) {
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
        const userToBeFollowed = await User.findOne({ username: req.params.username });
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
            await userToBeFollowed.updateOne({ $push: { followers: currentUser.username } });
            await currentUser.updateOne({ $push: { following: userToBeFollowed.username } });
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
        const userToBeUnfollowed = await User.findOne({ username: req.params.username });
        if (!userToBeUnfollowed) {
            return res.status(404).json({ error: "User to be unfollowed not found!" });
        }

        // get current user
        const currentUser = await User.findOne({ username: req.user.username });
        if (!currentUser) {
            return res.status(404).json({ error: "Current user not found!" });
        }

        // unfollow logic
        if (userToBeUnfollowed.followers.includes(currentUser.username)) {
            await userToBeUnfollowed.updateOne({ $pull: { followers: currentUser.username } });
            await currentUser.updateOne({ $pull: { following: userToBeUnfollowed.username } });
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
        const sanitizedUsers = users.map(user => {
            const { password, email, ...userInfo } = user._doc;
            return userInfo;
        });

        res.status(200).json(sanitizedUsers);
    } catch(err) {
        next(err);
    }
}

// Modify the getUserFollowers function to include details
const getUserFollowers = async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.params.username });
  
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      // Include follower details
      const sanitizedFollowers = user.followers.map(async (followerUsername) => {
        const follower = await User.findOne({ username: followerUsername });
        return {
          username: follower.username,
          profilePicture: follower.profilePicture,
          // Include other details as needed
        };
      });
  
      const followersWithDetails = await Promise.all(sanitizedFollowers);
  
      res.status(200).json(followersWithDetails);
    } catch (err) {
      console.error("Error:", err);
      next(err);
    }
  };
  


// const getUserFollowers = async (req, res, next) => {
//     try {
//         // Get user followers
//         const user = await User.findOne({ username: req.params.username });

//         if (!user) {
//             return res.status(404).json({ error: "User not found!" });
//         }

//         // Extract follower usernames
//         const followerUsernames = user.followers;

//         // Fetch details for each follower
//         const followerDetailsPromises = followerUsernames.map(async (followerUsername) => {
//             const follower = await User.findOne({ username: followerUsername });
//             return follower;
//         });

//         // Wait for all follower details to be fetched
//         const followerDetails = await Promise.all(followerDetailsPromises);

//         // Sanitize and send follower details
//         const sanitizedFollowers = followerDetails.map(follower => ({
//             id: follower._id,
//             username: follower.username,
//             firstname: follower.firstname,
//             lastname: follower.lastname,
//             profilePicture: follower.profilePicture,
//             email: follower.email,
//             // Add other details as needed
//         }));

//         res.status(200).json(sanitizedFollowers);
//     } catch (err) {
//         console.error("Error:", err);
//         next(err);
//     }
// };






export {getUser, updateUser, deleteUser, followUser, unfollowUser, whoToFollow, getUserFollowers};

