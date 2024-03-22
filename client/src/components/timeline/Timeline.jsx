import React, { useState } from "react";
import { useSelector } from "react-redux";
import TimelineTweets from "../timelineTweets/TimelineTweets";
import CreateTweet from "../createTweet/CreateTweet";
import axios from "axios";

const Timeline = () => {
  return (
    <div>
      <CreateTweet />
      <TimelineTweets />
    </div>
  );
};

export default Timeline;
