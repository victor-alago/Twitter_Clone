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

  const [activeTab, setActiveTab] = useState("posts");

  const [openModal, setOpenModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { username } = useParams();

  const fetchUserMedia = async () => {
    try {
      // Make an API call to get the user media
      const response = await axios.get(`/users/${username}/media`, {
        withCredentials: true,
      });
      // Set the user media data to state
      setUserMedia(response.data);
    } catch (error) {
      console.log("Error fetching user media:", error.response || error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userProfile = await axios.get(`/users/find/${username}`);
        setUserProfile(userProfile.data);

        // Get user tweets
        const userTweets = await axios.get(`/tweets/${username}/tweets`);
        setUserTweets(userTweets.data);

        // Get user likes
        const userLikes = await axios.get(`/users/${username}/likes`);
        setUserLikes(userLikes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchUserMedia();
  }, [currentUser, username]);

  console.log(currentUser.username, username);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6 pt-[70px]">
          <LeftSideBar />
        </div>

        <div className="feed col-span-2 border-x-2 border-t-slate-800 px-6 overflow-y-auto h-screen pt-[70px]">
          <div className="flex justify-between items-center">
            <img
              src={userProfile && userProfile.profilePicture}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full object-cover"
            />

            {/* User details */}
            <div>
              <h1 className="text-2xl font-bold">{userProfile && userProfile.firstname} {userProfile && userProfile.lastname}</h1>
              <span className="text-gray-500">@{userProfile && userProfile.username}</span>
              <p className="text-gray-500">{userProfile && userProfile.bio}</p>
              <p>{userProfile && userProfile.following.length}</p>
              <p>{userProfile && userProfile.followers.length}</p>
            </div>

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

          <div className="profile-tabs border-b border-gray-300">
            {/* Tabs for "Posts", "Media", "Likes" */}
            <div className="flex justify-around text-sm font-medium text-gray-500">
              <button
                className={`px-4 py-2 ${
                  activeTab === "posts"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "media"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("media")}
              >
                Media
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "likes"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("likes")}
              >
                Likes
              </button>
            </div>

              {/* Content below the tabs */}
              <div>
                {activeTab === 'posts' && (
                  <div className="posts">
                    {/* Map through posts and render them */}
                    {userTweets &&
                      userTweets.map((tweet) => (
                        <div key={tweet._id}>
                          <Tweet tweet={tweet} setData={setUserTweets} />
                        </div>
                      ))}
                  </div>
                )}
                {/* USER MEDIA */}
                {activeTab === 'media' && (
                  <div className="flex flex-wrap justify-center md:justify-start">
                    {userMedia && userMedia.length > 0 ? (
                      userMedia.map((mediaItem, index) => (
                        <div key={index} className="w-1/3 p-1">
                          <img src={mediaItem} alt={`Media ${index + 1}`} className="w-full h-auto aspect-square object-cover" />
                        </div>
                      ))
                    ) : (
                      <p>No media found.</p>
                    )}
                  </div>
                )}
                {activeTab === 'likes' && (
                  <div className="likes">
                    {/* Map through likes and render them */}
                    {userLikes &&
                      userLikes.map((tweet) => (
                        <div key={tweet._id}>
                          <Tweet tweet={tweet} setData={setUserLikes} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
  
          <div className="px-6 pt-[70px]">
            <RightSideBar />
          </div>
        </div>
  
        {/* EDIT PROFILE MODAL */}
        {openModal && <EditProfile setOpen={setOpenModal} />}
      </>
    );
  };
  
  export default Profile;
  