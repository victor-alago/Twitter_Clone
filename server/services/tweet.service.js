import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import handleError from "../error.js";

// create a tweet
const createTweet = async (req, res, next) => {
  const username = req.user.username;
  // const content = req.body.content;
  const newTweet = new Tweet({ username, ...req.body });
  try {
    const savedTweet = await newTweet.save();
    return res.status(200).json(savedTweet);
  } catch (err) {
    return next(handleError(500, err.message));
  }
};

// get a tweet
// const getTweet = async (req, res, next) => {
//   const comments = [];
//   try {
//     // get tweet
//     const tweet = await Tweet.find({ _id: req.params.id });
//     // get all comments on that tweet
//     if (!tweet[0].comments) {
//       return res.status(200).json(tweet);
//     } else {
//       const tweetComments = await Promise.all(
//         tweet[0].comments.map((commentId) => {

//           return Tweet.find({ _id: commentId });
//         })

//       );
//     comments.push(tweetComments);
//       // return tweet and comments
//       res.status(200).json(tweet.concat(...comments));
//     }
//   } catch (err) {
//     console.log(err);
//     return next(handleError(500, err.message));
//   }
// };

const getTweet = async (req, res, next) => {
  try {
    // Get tweet
    const tweet = await Tweet.find({ _id: req.params.id });

    // Check if tweet exists
    if (!tweet[0]) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if tweet has comments
    if (tweet[0].comments && tweet[0].comments.length > 0) {
      // Fetch all comments on the tweet
      const tweetComments = await Promise.all(
        tweet[0].comments.map((commentId) => {
          return Tweet.find({ _id: commentId });
        })
      );

      // Extract comment objects
      const comments = tweetComments.map(comment => comment[0]);

      // Create the desired format: [{ mainTweet }, [ { comment1 }, { comment2 } ]]
      const formattedTweet = [tweet[0], comments];
      
      // Return the formatted tweet
      res.status(200).json(formattedTweet);
    } else {
      // If tweet has no comments, return only the main tweet
      res.status(200).json([tweet[0], []]);
    }
  } catch (err) {
    console.log(err);
    return next(handleError(500, err.message));
  }
};



//delete tweet
const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("Tweet has been deleted");
    } else {
      return next(
        handleError(500, "You can have to login to delete your tweet")
      );
    }
  } catch (err) {
    next(err);
  }
};

// like or dislike a tweet
const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.user.username)) {
      await tweet.updateOne({ $push: { likes: req.user.username } });
      res.status(200).json("Tweet liked!");
    } else {
      await tweet.updateOne({ $pull: { likes: req.user.username } });
      res.status(200).json("Tweet disliked!");
    }
  } catch (err) {
    return next(handleError(500, "Tweet not found!"));
  }
};


// retweet a tweet
const retweetUnretweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.retweets.includes(req.user.username)) {
      await tweet.updateOne({ $push: { retweets: req.user.username } });
      res.status(200).json("Tweet retweeted!");
    } else {
      await tweet.updateOne({ $pull: { retweets: req.user.username } });
      res.status(200).json("Tweet unretweeted!");
    }
  } catch (err) {
    return next(handleError(500, "Tweet not found!"));
  }
};

// comment on a tweet
const commentTweet = async (req, res, next) => {
  const username = req.user.username;
  const originalTweet = await Tweet.findById(req.params.id);
  // const content = req.body.content;
  const newTweet = new Tweet({ username, ...req.body });
  try {
    // save new comment tweet
    const savedTweet = await newTweet.save();
    // add comment tweet id to original tweet comments array
    await originalTweet.updateOne({ $push: { comments: savedTweet._id } });
    return res.status(200).json(savedTweet);
  } catch (err) {
    return next(handleError(500, err.message));
  }
};


// get timeline tweets for a user
const getTimelineTweets = async (req, res, next) => {
  try {
    // get current user
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // get user's tweets
    const userTweets = await Tweet.find({
      username: currentUser.username,
    }).sort({ createdAt: -1 });

    // get user's following tweets
    const followingTweets = await Tweet.find({
      username: { $in: currentUser.following },
    }).sort({ createdAt: -1 });

    // return all tweets
    const allTweets = userTweets.concat(followingTweets);
    res.status(200).json(allTweets);
  } catch (err) {
    return next(handleError(500, err.message));
  }
};

// get only user tweets
const getUserTweets = async (req, res, next) => {
  try {
    // get user's tweets, sort by latest
    const userTweets = await Tweet.find({ username: req.params.username }).sort(
      { createdAt: -1 }
    );
    const userRetweets = await Tweet.find({
      retweets: { $in: [req.params.username] },
    }).sort({ createdAt: -1 });

    // Combine user's tweets and retweets into a single array
    const allTweets = [...userTweets, ...userRetweets];

    // Return combined tweets sorted by latest
    res.status(200).json(allTweets);
  } catch (err) {
    return next(handleError(500, "User not found!"));
  }
};

//getting tweets for explore page which are trending tweets
const getExploreTweets = async (req, res, next) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 }); //trending tweets

    res.status(200).json(getExploreTweets);
  } catch (err) {
    next(err);
  }
};

// bookmark a tweet
const bookmarkTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.bookmarks.includes(req.user.username)) {
      await tweet.updateOne({ $push: { bookmarks: req.user.username } });
      res.status(200).json("Tweet bookmarked!");
    } else {
      await tweet.updateOne({ $pull: { bookmarks: req.user.username } });
      res.status(200).json("Tweet removed from bookmarks!");
    }
  } catch (err) {
    return next(handleError(500, "Tweet not found!"));
  }
};


// Retrieve bookmarked tweets for a user
const getBookmarkedTweets = async (req, res, next) => {
  try {
    // Use the username from the authenticated user's request
    const username = req.user.username;
    const bookmarkedTweets = await Tweet.find({
      bookmarks: username // Assuming username is unique and correctly identifies the user
    }).sort({ createdAt: -1 }); // Sort by creation time for recency

    res.status(200).json(bookmarkedTweets);
  } catch (err) {
    // Pass the error to the next middleware (which could be an error handling middleware)
    next(err);
  }
};


const getTrending = async (req, res, next) => {
  try {
    // Decode the hashtag from the URL parameter
    // You have to decode it because it is encoded in the frontend
    const hashtag = decodeURIComponent(req.params.tag);

    // get only tweets with likes, sort by highest likes
    const exploreTweets = await Tweet.find({
      content: { $regex: `${hashtag}`, $options: "i" },
    });

    // return users tweets
    res.status(200).json(exploreTweets);
  } catch (err) {
    console.log(err);
    return next(handleError(500, "There are no tweets with this hashtag!"));
  }
};


const getTrendingTags = async (req, res, next) => {
try {
  // get only tweets with hashtags, sort by highest likes
  const exploreTweets = await Tweet.find({
    content: { $regex: "#", $options: "i" },
  });

  // initialize empty array to store hashtags
  const hashtags = [];

  // get all hashtags from tweets
  exploreTweets.forEach((tweet) => {
    const tweetHashtags = tweet.content.match(/#\w+/g);
    if (tweetHashtags) {
      hashtags.push(...tweetHashtags);
    }
  });

  // count the frequency of each hashtag
  const tagCounts = {};

  hashtags.forEach((tag) => {
    if(tagCounts[tag]){
      tagCounts[tag]++;
    } else {
      tagCounts[tag] = 1;
    }
  });

  // convert object to array
  const trendsArray = Object.entries(tagCounts).map(([key, value]) => ({ key, value }));
  // return users tweets
  res.status(200).json(trendsArray);
} catch (err) {
  console.log(err);
  return next(handleError(500, "There are no tweets with hashtags!"));
}
};


export {
  createTweet,
  getTweet,
  deleteTweet,
  likeOrDislike,
  retweetUnretweet,
  commentTweet,
  getTrending,
  getUserTweets,
  getExploreTweets,
  bookmarkTweet,
  getTimelineTweets,
  getBookmarkedTweets,
  getTrendingTags,
};
