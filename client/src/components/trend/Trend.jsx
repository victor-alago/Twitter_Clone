import React from "react";
import { Link } from "react-router-dom";

const Trend = ({ tag }) => {
  const route = encodeURIComponent(tag.key);
  return (
    <div className="flex items-center gap-2">
      <p className="text-xl">🔥</p>
      <span>Trending</span>
      <Link to={`/trending/${route}`}>
        <p className="text-xl font-bold">{tag.key}</p>
      </Link>
      <p>{tag.value} Tweets</p>
    </div>
  );
};

export default Trend;
