import React, { useState, useEffect } from "react";
import Trend from "../trend/Trend";
import axios from "axios";

const TrendingHashtags = () => {
  const [trends, setTrends] = useState([]);
  

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get("/tweets/trending/");
        setTrends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrends();
    console.log(trends);
  }, []);

  return (
    <div className="absolute top-[calc(70px + 10px)] right-0 bg-blur flex items-start justify-end w-[calc(80vw - 20px)]">
      <div className="relative w-[320px] bg-slate-200 rounded-lg p-4 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Trending</h2>
        {trends.map((tag) => (
          <Trend key={tag.key} tag={tag} />
        ))}
      </div>
    </div>
  );
};

export default TrendingHashtags;
