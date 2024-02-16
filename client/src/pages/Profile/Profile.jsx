import React, { useState, useEffect } from "react";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";
import RightSideBar from "../../components/rightSideBar/RightSideBar";
import Tweet from "../../components/tweet/Tweet";
import EditProfile from "../../components/editProfile/EditProfile";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [userTweets, setUserTweets] = useState(null);
    const [userLikes, setUserLikes] = useState(null);
    const [userReplies, setUserReplies] = useState(null);
    const [userMedia, setUserMedia] = useState(null);
    const [userBookmarks, setUserBookmarks] = useState(null);
  
    const [activeTab, setActiveTab] = useState("tweets");
  
    const [openModal, setOpenModal] = useState(false);
  
    const { currentUser } = useSelector((state) => state.user);
    const { username } = useParams();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Get user profile
          const userProfile = await axios.get(`/users/find/${username}`);
          setUserProfile(userProfile.data);
  
          // Get user tweets
          const userTweets = await axios.get(`/tweets/${username}/tweets`);
          setUserTweets(userTweets.data);
        } catch (err) {
          console.log(err);
        }
      };
  
      fetchData();
    }, [currentUser, username]);
  
    console.log(currentUser.username, username);
  
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="px-6">
            <LeftSideBar />
          </div>
  
          <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
            <div className="flex justify-between items-center">
              <img 
                src={ userProfile && userProfile.profilePicture} 
                alt="Profile Picture" 
                className="w-20 h-20 rounded-full object-cover"
                />
  
              {/* If profile page is for the current user, show edit profile button */}
              {currentUser.username === username ? (
                <button
                  className="bg-blue-500 text-white rounded-full px-4 py-2"
                  onClick={() => setOpenModal(true)}
                >
                  Edit Profile
                </button>
              ) : // If the current user is following the profile user, show "Following" button
              currentUser.following.includes(username) ? (
                <button className="bg-blue-500 text-white rounded-full p-2">
                  Following
                </button>
              ) : (
                // Otherwise, show "Follow" button
                <button className="bg-blue-500 text-white rounded-full p-2">
                  Follow
                </button>
              )}
            </div>
  
            {/* USER TWEETS */}
            <div>
              {userTweets &&
                userTweets.map((tweet) => (
                  <div key={tweet._id}>
                    <Tweet tweet={tweet} setData={setUserTweets} />
                  </div>
                ))}
            </div>
          </div>
  
          <div className="px-6">
            <RightSideBar />
          </div>
        </div>
  
        {/* EDIT PROFILE MODAL */}
        {openModal && <EditProfile setOpen={setOpenModal} />}
      </>
    );
  };
  
  export default Profile;
  