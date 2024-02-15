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

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            await Tweet.remove({userId: req.params.id});
            res.status(200).json("User deleted successfully");
        } catch (err) {
            next(err);
        }
    } else {
        return next(handleError(403, 'You are not authorized to update this user!'));
    }
};

export const follow = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        const currentUser = await User.findById(req.body.id);

        if(!user.followers.includes(req.body.id)) {
            await user.updateOne ({
                $push: {
                    followers: req.body.id
                }
            });

            await currentUser.updateOne ({
                $push: {
                    following: req.params.id 
                }
            });
        } else {
            res.status(403).json("You are already following this user!");
        }
        res.status(200).json('Followed successfully');
    } catch (err) {
        next(err);
    }
};

export const unFollow = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        const currentUser = await User.findById(req.body.id);

        if(currentUser.following.includes(req.params.id)) {
            await user.updateOne ({
                $pull: {
                    followers: req.body.id
                }
            });

            await currentUser.updateOne ({
                $pull: {
                    following: req.params.id 
                }
            });
        } else {
            res.status(403).json("You are not following this user!");
        }
        res.status(200).json('Unfollowed successfully');
    } catch (err) {
        next(err);
    }
};

export const removeFollower = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        const currentUser = await User.findById(req.body.id);

        if(currentUser.followers.includes(req.params.id)) {
            await currentUser.updateOne ({
                $pull: {
                    followers: req.params.id
                }
            });

            await user.updateOne ({
                $pull: {
                    following: req.body.id 
                }
            });
        } else {
            res.status(403).json("This user is not following you");
        }
        res.status(200).json('Removed follower successfully');
    } catch (err) {
        next(err);
    }
};
