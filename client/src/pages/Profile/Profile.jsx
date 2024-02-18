import React, { useState, useEffect } from "react";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";
import RightSideBar from "../../components/rightSideBar/RightSideBar";
import Tweet from "../../components/tweet/Tweet";
import EditProfile from "../../components/editProfile/EditProfile";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { followUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

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
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userProfile = await axios.get(`/users/find/${username}`);
        setUserProfile(userProfile.data);

        // Get user tweets
        const userTweets = await axios.get(`/tweets/${username}/tweets`);
        setUserTweets(userTweets.data);

        // Get user media
        const userMedia = await axios.get(`/tweets/${username}/media`);
        setUserMedia(userMedia.data);

        // Get user likes
        const userLikes = await axios.get(`/tweets/${username}/likes`);
        setUserLikes(userLikes.data);

        // Get user likes
        const userBookmarks = await axios.get(`/tweets/${username}/bookmarks`);
        setUserBookmarks(userBookmarks.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentUser, username]);

  // console.log(currentUser.username, username);

  // Follow or unfollow a user
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
        dispatch(followUser(username));
        // console.log(unfollow.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6">
          <LeftSideBar />
        </div>

        <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
          <div className="flex justify-between items-center">
            <img
              src={userProfile && userProfile.profilePicture}
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
              <button
                onClick={handleFollow}
                className="bg-blue-500 text-white rounded-full p-2"
              >
                Following
              </button>
            ) : (
              // Otherwise, show "Follow" button
              <button
                onClick={handleFollow}
                className="bg-blue-500 text-white rounded-full p-2"
              >
                Follow
              </button>
            )}

            
          </div>
          <div>
              <h1 className="text-2xl font-bold">
                {userProfile && userProfile.firstname}{" "}
                {userProfile && userProfile.lastname}
              </h1>
              <p className="text-gray-500">
                @{userProfile && userProfile.username}
              </p>
              <p>{userProfile && userProfile.bio}</p>
              <p>{userProfile && userProfile.following.length} Following</p>
              <p>{userProfile && userProfile.followers.length} Followers</p>
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
