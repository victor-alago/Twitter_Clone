import Tweet from '../models/tweet.js';
import User from '../models/user.js';
import { handleError } from '../error.js';


//create tweet
export const createTweet = async (req, res, next) => {
    const newTweet = new Tweet(req.body);
    try{
        const savedTweet = await newTweet.save();
        res.status(200).json(savedTweet);
    }catch(err){
        handleError(500, err);
        // next(err);
    }
};



//delete tweet
export const deleteTweet = async (req, res, next) => {
    try{
        const tweet = await Tweet.findById(req.params.id);
        if(tweet.userId === req.body.id){
            await tweet.deleteOne();
            res.status(200).json("Tweet has been deleted");
        }else{
            return next(handleError(500, "You can have to login to delete your tweet"));
        }
    }catch(err){
        next(err);
    }
};