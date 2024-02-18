import express from "express";
import {
  createTweet,
  getTweet,
  deleteTweet,
  likeOrDislike,
  // getLikedTweets,
  retweetUnretweet,
  commentTweet,
  // getCommentTweets,
  getTrending,
  getUserTweets,
  getExploreTweets,
  bookmarkTweet,
  // getBookmarkedTweets,
  getTimelineTweets,
  // getUserMedia
} from "../services/tweet.service.js";
import verify from "../verifyToken.js";

const router = express.Router();

// create a tweet
router.post("/", verify, createTweet);

// get a tweet(not necessary to verify)
router.get("/find/:id", getTweet);

//delete a tweet
router.delete("/:id", verify, deleteTweet);

// comment on a tweet
router.post("/:id/comment", verify, commentTweet);

// like or dislike a tweet
router.put("/:id/like", verify, likeOrDislike);

// retweet or unretweet a tweet
router.put("/:id/retweet", verify, retweetUnretweet);

// bookmark a tweet
router.put("/:id/bookmark", verify, bookmarkTweet);

// get timeline tweet (user tweets and accounts followed tweets)
router.get("/timeline", verify, getTimelineTweets);

// get one users tweets
router.get("/:username/tweets", verify, getUserTweets);

// get all tweets
router.get("/explore/", verify, getExploreTweets);

// get trending hashtags
router.get("/search/:word", verify, getTrending);

export default router;
