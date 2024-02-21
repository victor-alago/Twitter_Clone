import React, { useState, useEffect } from "react";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";
import RightSideBar from "../../components/rightSideBar/RightSideBar";
import Tweet from "../../components/tweet/Tweet";
import EditProfile from "../../components/editProfile/EditProfile";
import axios from "axios";
import { followUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userTweets, setUserTweets] = useState(null);
  const [userLikes, setUserLikes] = useState(null);
  const [userMedia, setUserMedia] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");

  const [openModal, setOpenModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { username } = useParams();
  const dispatch = useDispatch();

  // Function to handle the follow button click
  const handleFollow = async () => {
    if (!currentUser.following.includes(username)) {
      try {
        const follow = await axios.put(`/users/follow/${username}`);
        dispatch(followUser(username));
        // console.log(follow.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const unfollow = await axios.put(`/users/unfollow/${username}`);
        // Dispatch the followUser action with the username as payload
        dispatch(followUser(username));
      } catch (err) {
        console.log(err);
      }
    }
  };

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
          <div className="relative p-4">
            {/* Background Image Placeholder */}
            <div className="absolute top-0 left-0 w-full max-h-48">
            {userProfile && userProfile.bannerPicture ? (
              <img
                src={userProfile.bannerPicture}
                alt="Banner"
                className="max-h-48 w-full object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-400"></div>
            )}  
          </div>


            {/* Container for the content below the background */}
            <div className="relative mt-28 pb-4">
              {/* Profile Image */}
              <div className="flex justify-center md:justify-start -mt-2">
                <img
                  src={
                    userProfile && userProfile.profilePicture
                      ? userProfile.profilePicture
                      : "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white bg-white"
                />
              </div>

              {/* Container for Information and Button */}
              <div className="mt-2 md:flex md:justify-between md:items-end">
                {/* User Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">
                    {userProfile && userProfile.firstname}{" "}
                    {userProfile && userProfile.lastname}
                  </h1>
                  <span className="text-gray-500">
                    @{userProfile && userProfile.username}
                  </span>
                  <p className="text-gray-500">
                    {userProfile && userProfile.bio}
                  </p>
                  <div className="flex justify-center space-x-4 md:justify-start">
                    <p>
                      <span className="font-bold">
                        {userProfile && userProfile.following.length}
                      </span>{" "}
                      Following
                    </p>
                    <p>
                      <span className="font-bold">
                        {userProfile && userProfile.followers.length}
                      </span>{" "}
                      Followers
                    </p>
                  </div>
                </div>

              {/* Action Button */}
              <div className="mt-4 md:mt-0">
                {currentUser.username === username ? (
                  <button
                    className="bg-blue-500 text-white rounded-full px-4 py-2"
                    onClick={() => setOpenModal(true)}
                  >
                    Edit Profile
                  </button>
                ) : currentUser.following.includes(username) ? (
                  <button className="bg-blue-500 text-white rounded-full px-4 py-2"
                   onClick={handleFollow}>
                    Following
                  </button>
                ) : (
                  <button className="bg-blue-500 text-white rounded-full px-4 py-2"
                  onClick={handleFollow}>
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

          <div className="profile-tabs border-b-2 border-gray-300">
            {/* Tabs for "Posts", "Media", "Likes" */}
            <div className="flex justify-around text-sm font-medium text-gray-500 mb-10 border-b-2">
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
              {activeTab === "posts" && (
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
              {activeTab === "media" && (
                <div className="flex flex-wrap justify-center md:justify-start">
                  {userMedia && userMedia.length > 0 ? (
                    userMedia.map((mediaItem, index) => {
                      // Determine if the media item is a video by looking for video file extensions in the URL
                      const isVideo = mediaItem.match(/\.(mp4|mov|avi|wmv|flv|mkv)(\?alt=media&token=[\w-]+)?$/i);

                      return (
                        <div key={index} className="w-1/3 p-1">
                          {isVideo ? (
                            // Render a video element for video URLs
                            <video
                              controls
                              className="w-full h-auto aspect-square object-cover"
                            >
                              <source
                                src={mediaItem}
                                type={`video/${
                                  mediaItem.split(".").pop().split("?")[0]
                                }`}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            // Render an image element for image URLs
                            <img
                              src={mediaItem}
                              alt={`Media ${index + 1}`}
                              className="w-full h-auto aspect-square object-cover"
                            />
                          )}
                        </div>
                      );
                    })
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
  