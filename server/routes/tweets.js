import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislikeTweet,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} from "../services/tweet.service.js";

const router = express.Router();

router.post("/", verifyToken, createTweet);

router.delete("/:id", verifyToken, deleteTweet);

//like or dislike a tweet
router.put("/:id/like", verifyToken, likeOrDislikeTweet);

//get all timeline tweets
router.get("/timeline/:id", getAllTweets);

//get only the user's tweets
router.get("/user/all/:id", getUserTweets);

//explore, contains all tweets from all users, most liked tweets, most retweeted tweets
router.get("/explore", getExploreTweets); //trending tweets

export default router;
