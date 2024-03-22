import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import formatDistance from "date-fns/formatDistance";
import { Link, useLocation, useParams } from "react-router-dom";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";

const Tweet = ({ tweet, setData }) => {
  // get the current user from the redux store
  const { currentUser } = useSelector((state) => state.user);
  // set the user user's data from the tweet
  const [userData, setUserData] = useState(null);

  // calculate the date distance between when the tweet was created and the current date
  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());

  // get the current location
  const location = useLocation().pathname;
  // console.log(location)

  // get the username from the url
  const { username } = useParams();


  const [isBookmarked, setIsBookmarked] = useState(tweet.bookmarks.includes(currentUser.username));

  // useEffect to get the user data from the tweet
  useEffect(() => {
    // function to get the user data from the tweet
    const fetchData = async () => {
      try {
        // get the user from the tweet
        const findUser = await axios.get(`/users/find/${tweet.username}`);
        // set the user data to state
        setUserData(findUser.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    // only run the effect if the tweet, likes, or retweets change
  }, [tweet.username, tweet.likes, tweet.retweets]);

  // function to handle the like and unlike of a tweet
  const handleLikeUnlike = async (e) => {
    e.preventDefault();

    try {
      // like or unlike the tweet
      const like = await axios.put(`/tweets/${tweet._id}/like`);

      // if the location is the profile page, get the user's tweets
      if (location.includes("profile")) {
        const newData = await axios.get(`/tweets/${username}/tweets`);
        setData(newData.data);
        // if the location is the explore page, get the explore tweets
      } else if (location.includes("explore")) {
        const newData = await axios.get(`/tweets/explore`);
        setData(newData.data);
        // if the location is the timeline page, get the timeline tweets
      } else {
        const newData = await axios.get(`/tweets/timeline`);
        setData(newData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to handle the retweet of a tweet
  const handleRetweet = async () => {
    try {
      // retweet or unretweet the tweet
      await axios.put(`/tweets/${tweet._id}/retweet`);

      // if the location is the profile page, get the user's tweets
      if (location.includes("profile")) {
        const newData = await axios.get(`/tweets/${username}/tweets`);
        setData(newData.data);
        // if the location is the explore page, get the explore tweets
      } else if (location.includes("explore")) {
        const newData = await axios.get(`/tweets/explore/`);
        setData(newData.data);
        // if the location is the timeline page, get the timeline tweets
      } else {
        const newData = await axios.get(`/tweets/timeline`);
        setData(newData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to handle the comment of a tweet
  const handleComment = async () => {};

  // function to handle the bookmark of a tweet
  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      // bookmark tweet or remove the tweet from bookmarks
      await axios.put(`/tweets/${tweet._id}/bookmark`);

      // if the location is the profile page, get the user's tweets
      if (location.includes("profile")) {
        const newData = await axios.get(`/tweets/${username}/tweets`);
        setData(newData.data);
        // if the location is the explore page, get the explore tweets
      } else if (location.includes("explore")) {
        const newData = await axios.get(`/tweets/explore/`);
        setData(newData.data);
        // if the location is the timeline page, get the timeline tweets
      } else if (location.includes("bookmark")) {
        const newData = await axios.get('/bookmarks');
        setData(newData.data);
      } else {
        const newData = await axios.get(`/tweets/timeline`);
        setData(newData.data);
      }
    } catch (error) {
      console.log(error);
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <div className="border-b-2 mb-5">
      {userData && (
        <>
          <div className="flex space-x-2 border-bottom">
            <Link to={`/profile/${userData.username}`}>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={
                  !userData.profilePicture
                    ? "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
                    : userData.profilePicture
                }
                alt=""
              />
            </Link>

            <Link to={`/profile/${userData.username}`}>
              <h2 className="font-bold">
                {userData.firstname} {userData.lastname}
              </h2>
            </Link>

            <Link to={`/profile/${userData.username}`}>
              <span className="font-normal">@{userData.username}</span>
            </Link>
            <p>-{dateStr}</p>
          </div>

          <div>
            <p>{tweet.content}</p>

            {tweet.media &&
              (tweet.media.includes(".mp4") ||
              tweet.media.includes(".avi") ||
              tweet.media.includes(".mov") ||
              tweet.media.includes(".wmv") ||
              tweet.media.includes(".flv") ||
              tweet.media.includes(".mkv") ? (
                <video
                  className="w-full h-80 object-cover rounded-lg"
                  controls
                  src={tweet.media}
                />
              ) : (
                <img
                  className="w-full h-80 object-cover rounded-lg"
                  src={tweet.media}
                  alt="Media"
                />
              ))}
          </div>

          <div className="flex justify-between">
            <button onClick={handleLikeUnlike} className="mr-10 my-2">
              {tweet.likes.includes(currentUser.username) ? (
                <FavoriteIcon className="cursor-pointer" />
              ) : (
                <FavoriteBorderIcon className="cursor-pointer" />
              )}
              {tweet.likes.length}
            </button>

            <button onClick={handleRetweet} className="mr-10 my-2">
              {tweet.retweets.includes(currentUser.username) ? (
                <RepeatOnIcon className="cursor-pointer" />
              ) : (
                <RepeatIcon className="cursor-pointer" />
              )}
              {tweet.retweets.length}
            </button>

            <Link to={`/tweets/find/${tweet._id}`}>
              <button onClick={handleComment} className="mr-10 my-2">
                <ChatBubbleOutlineRoundedIcon />
                {tweet.comments.length}
              </button>
            </Link>

            <button onClick={handleBookmark} className="mr-10 my-2">
              {isBookmarked ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
