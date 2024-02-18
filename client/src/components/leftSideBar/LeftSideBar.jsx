import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import CreateTweetModal from "../createTweetModal/CreateTweetModal";
import axios from "axios";
import { useParams } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';

const LeftSideBar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userMedia, setUserMedia] = useState(null);

  const toggleOptions = () => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  };
  
  const [userProfile, setUserProfile] = useState(null);
  const { username } = useParams();
  // get user from the redux store
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userProfile = await axios.get(`/users/find/${username}`);
        setUserProfile(userProfile.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentUser, username]);

  return (
    <>
      <div className="flex flex-col h-full md:h-[90vh] justify-between mr-6">
        <div className="mt-6 flex flex-col space-y-4">
          <Link to="/">
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <HomeIcon fontSize="large" />
              <p>Home</p>
            </div>
          </Link>
          <Link to="/explore">
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <TagIcon fontSize="large" />
              <p>Explore</p>
            </div>
          </Link>
          <Link to="/bookmark">
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <BookmarkIcon fontSize="large" />
              <p>Bookmark</p>
            </div>
          </Link>
          <Link to={`/${currentUser.username}/messages`}>
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <MailIcon fontSize="large" />
              <p>Messages</p>
            </div>
          </Link>
          <Link to={`/profile/${currentUser.username}`}>
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <PersonIcon fontSize="large" />
              <p>Profile</p>
            </div>
          </Link>
          <Link to="/setting">
            <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
              <SettingsIcon fontSize="large" />
              <p>Setting</p>
            </div>
          </Link>

          <button
            className="bg-blue-500 text-white rounded-full px-4 py-2"
            onClick={() => setOpenModal(true)}
          >
            Tweet
          </button>
        </div>

        <div className="relative mb-6 h-16">
          <button
            className="account flex justify-between items-center p-4 w-full border-0 rounded-full cursor-pointer hover:bg-gray-200"
            onClick={toggleOptions}
          >
            <img
              src={currentUser && currentUser.profilePicture ? currentUser.profilePicture : "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-bold">
              {currentUser && currentUser.firstname} {currentUser && currentUser.lastname}
              </p>
              <p className="font-normal">@{currentUser.username}</p>
            </div>
            <div>
                {/* Icon with three dots */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </div>
          </button>
          {showOptions && (
            <div className="relative mb-2">
              <div className="absolute inset-x-0 bottom-24 transform bg-white rounded-xl shadow-xl z-20 ring ring-gray-300 ring-opacity-50">
                <div className="py-2">
                  {/* Menu items */}
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 font-bold"
                    onClick={handleLogout}
                  >
                    Log out from @{currentUser.username}
                  </button>
                </div>
                {/* The tail (triangle) */}
                <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 rotate-180 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create tweet modal */}
      {openModal && <CreateTweetModal setOpen={setOpenModal} />}
    </>
  );
};

export default LeftSideBar;
