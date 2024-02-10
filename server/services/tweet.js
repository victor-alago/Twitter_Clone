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
