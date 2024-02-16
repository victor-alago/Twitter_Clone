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


// like or dislike a tweet
export const likeOrDislike = async (req, res, next) => {
    try{
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.likes.includes(req.user.username)){
            await tweet.updateOne({$push: {likes: req.user.username}});
            res.status(200).json("Tweet liked!");
        }
        else{
            await tweet.updateOne({$pull: {likes: req.user.username}});
            res.status(200).json("Tweet disliked!");
        }
    } catch(err){
        return next(handleError(500, "Tweet not found!"));
    
    }
};

// retweet a tweet
export const retweetUnretweet = async (req, res, next) => {
    try{
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.retweets.includes(req.user.username)){
            await tweet.updateOne({$push: {retweets: req.user.username}});
            res.status(200).json("Tweet retweeted!");
        }
        else{
            await tweet.updateOne({$pull: {retweets: req.user.username}});
            res.status(200).json("Tweet unretweeted!");
        }
    } catch(err){
        return next(handleError(500, "Tweet not found!"));
    
    }
};


// comment on a tweet
const commentTweet = async (req, res, next) => {
    const username = req.user.username;
    const originalTweet = await Tweet.findById(req.params.id);
    // const content = req.body.content;
    const newTweet = new Tweet({username, ...req.body});
    try {
        // save new comment tweet
        const savedTweet = await newTweet.save();
        // add comment tweet id to original tweet comments array
        await originalTweet.updateOne({$push: {comments: savedTweet._id}})
        return res.status(200).json(savedTweet);
    } catch(err){
        return next(handleError(500, err.message))
    }
};


// get timeline tweets for a user
export const getTimelineTweets = async (req, res, next) => {
    try {
        // get current user
        const currentUser = await User.findOne({ username: req.user.username });
        if (!currentUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // get user's tweets
        const userTweets = await Tweet.find({ username: currentUser.username }).sort({ createdAt: -1 });

        // get user's following tweets
        const followingTweets = await Tweet.find({ username: { $in: currentUser.following } }).sort({ createdAt: -1 });

        // return all tweets
        const allTweets = userTweets.concat(followingTweets);
        res.status(200).json(allTweets);
    } catch (err) {
        return next(handleError(500, err.message));
    }
};


//getting tweets for explore page which are trending tweets
export const getExploreTweets = async (req, res, next) => {
    try{

        const getExploreTweets = await Tweet.find({ 
            likes: {$exists: true }}).sort({ likes: -1 }); //trending tweets

        res.status(200).json(getExploreTweets);
    } catch(err){
        next(err);
    }
};

// bookmark a tweet
export const bookmarkTweet = async (req, res, next) => {
    try{
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.bookmarks.includes(req.user.username)){
            await tweet.updateOne({$push: {bookmarks: req.user.username}});
            res.status(200).json("Tweet bookmarked!");
        }
        else{
            await tweet.updateOne({$pull: {bookmarks: req.user.username}});
            res.status(200).json("Tweet removed from bookmarks!");
        }
    } catch(err){
        return next(handleError(500, "Tweet not found!"));
    
    }
    
};

const getTrending = async (req, res, next) => {
    try {
        // Decode the hashtag from the URL parameter
        // You hqve to decode it because it is encoded in the frontend
        const hashtag = decodeURIComponent(req.params.word);

        // get only tweets with likes, sort by highest likes
        const exploreTweets = await Tweet.find({
            content: { $regex: `${hashtag}`, $options: 'i' }
        });

        // return users tweets
        res.status(200).json(exploreTweets);

    } catch (err) {
        console.log(err);
        return next(handleError(500, "There are no tweets!"));
    }
};

export { getTrending };



