import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import CreateTweetModal from "../createTweetModal/CreateTweetModal";

import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';

const LeftSideBar = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  // logout function
  const handleLogout = () => {
    dispatch(logout());
  };
  // get user from the redux store
  const { currentUser } = useSelector((state) => state.user);

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
          <Link to="/messages">
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
          <Link to="/setting/account">
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

        <div className="flex justify-between">
          <div>
            <p className="font-bold">
              {`${currentUser.firstname}`} {`${currentUser.lastname}`}
            </p>
            <p className="font-normal">@{`${currentUser.username}`}</p>
          </div>
          <div>
            <Link to="/login">
              <button
                className="bg-red-500 px-4 py-2 text-white rounded-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Create tweet modal */}
      {openModal && <CreateTweetModal setOpen={setOpenModal} />}
    </>
  );
};

export default LeftSideBar;
