import User from "../models/user.js";
import { handleError } from "../error.js";
import Tweet from "../models/tweet.js";

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },
            {
                new: true,
            });
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    } else {
        return next(handleError(403, 'You are not authorized to update this user!'));
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

export {deleteUser, followUser, unfollowUser};
