import React from "react";
import { Link } from "react-router-dom";

const Trend = ({ tag }) => {

const route  = tag.key.split('#')[1]
  return (
    <div className="flex items-center gap-2">
      <p className="text-xl">🔥</p>
      <span>Trending</span>
      <Link to={`/trending/%23${route}/tweets`}>
        <p className="text-xl font-bold">{tag.key}</p>
      </Link>
      <p>{tag.value} Tweets</p>
    </div>
  );
};

export default Trend;
