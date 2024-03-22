import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Tweet from "../tweet/Tweet";
import { useParams } from "react-router-dom";
import ReplyTweet from "../replyTweet/ReplyTweet";

const TweetAndReplies = () => {
  const [mainTweet, setMainTweet] = useState(null);
  const [replies, setReplies] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  // Fetch main tweet and replies when component mounts or currentUser changes
  useEffect(() => {
    const fetchTweetAndReplies = async () => {
      try {
        const response = await axios.get(`/tweets/find/${id}`);
        const data = response.data;

        // Check if main tweet exists
        if (data.length > 0) {
          setMainTweet(data[0]);

          // Check if replies exist
          if (data.length > 1) {
            setReplies(data[1]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchTweetAndReplies();
  }, [currentUser.username, id]);

  return (
    <div className="mt-6">
      {/* Render main tweet if it exists */}
      {mainTweet && <Tweet tweet={mainTweet} />}

      {/* Render ReplyTweet component if mainTweet exists */}
      {mainTweet && <ReplyTweet replyToId={id} />}

      {/* Render replies if they exist */}
      {replies &&
        replies.map((reply) => <Tweet key={reply._id} tweet={reply} />)}
    </div>
  );
};

export default TweetAndReplies;
