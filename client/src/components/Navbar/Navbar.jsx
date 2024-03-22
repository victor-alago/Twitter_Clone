import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import SearchIcon from "@mui/icons-material/Search";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";

const Navbar = () => {
  const location = useLocation(); // Use useLocation hook to get the current location

  // Determine the headline based on the current location
  const getHeadline = () => {
    if (location.pathname.includes("/explore")) {
      // Check if the pathname includes 'explore'
      return "Explore";
    } else if (location.pathname.includes("/bookmark")) {
      // Check if the pathname includes 'bookmark'
      return "Bookmark";
    } else if (location.pathname.includes("/profile")) {
      // Check if the pathname includes 'bookmark'
      return "Profile";
    } else if (location.pathname.includes("/messages")) {
      // Check if the pathname includes'messages'
      return "Messages";
    } else if (location.pathname.includes("/trending")) {
      // Check if the pathname includes'messages'
      return "Trending";
    } else if (location.pathname.includes("/tweets")) {
      // Check if the pathname includes'messages'
      return "Tweet";
    } else if (location.pathname.includes("/setting")) {
      // Check if the pathname includes'messages'
      return "Setting";
    }
    return "Home"; // Default to 'Home' if neither
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 py-4 justify-center fixed top-0 w-full z-10 bg-white border-2">
      <div className="mx-auto md:mx-0">
        <img src="/X-Logo.png" alt="logo" width={"40px"} className="ml-8" />
      </div>

      <div className="col-span-2 md:border-x-2 mb:border-slate-200 md:px-6 my-6 md:my-0">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl">{getHeadline()}</h2>{" "}
          {/* Dynamically set the headline */}
          <StarBorderPurple500Icon />
        </div>
      </div>

      <div className="px-0 md:px-6 mx-auto">
        <button className="bg-blue-500 text-white rounded-full px-4 py-2">
          Premium
        </button>
        {/* <SearchIcon className='absolute m-2'/>
            <input type="text" className='bg-blue-100 rounded-full py-2 px-8'/> */}
      </div>
    </div>
  );
};

export default Navbar;
