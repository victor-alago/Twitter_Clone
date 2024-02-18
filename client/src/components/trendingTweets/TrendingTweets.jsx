import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Tweet from "../tweet/Tweet";
import axios from "axios";

const TrendingTweets = ({tag}) => {
  const [trendingTweets, setTrendingTweets] = useState(null);
  const hashtag = encodeURIComponent(tag);

  useEffect(() => {
    const fetchTweets = async () => {
    
      try {
        const tweets = await axios.get(`/tweets/trending/${hashtag}/tweets`);
        setTrendingTweets(tweets.data);
        console.log(trendingTweets);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTweets();
  }, [tag]);

  console.log(trendingTweets);

  return (
    <div className="mt-6">
      {trendingTweets &&
        trendingTweets.map((tweet) => {
          return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setTrendingTweets} />
            </div>
          );
        })}
    </div>
  );
};

export default TrendingTweets;
