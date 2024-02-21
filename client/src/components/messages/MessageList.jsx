import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";

const MessageList = () => {

    const { currentUser } = useSelector((state) => state.user);

  const [followers, setFollowers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/users/${currentUser.username}/followers`);
        setFollowers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="bg-white p-4 rounded shadow col-span-4">
            <i className="">Have no conversations yet? Message any of your followers now!!</i>
            <br></br>
            <h2 className="text-2xl font-semibold mb-4">Your Followers</h2>
            <ul className="space-y-2">
                {followers.map((follower) => (
                    <a
                    key={follower.username}
                    href="/messages"
                    onClick={(e) => {
                        e.preventDefault();
                        handleUserClick(follower);
                    }}
                    className="block p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                    <li className="flex items-center">
                        <img
                        src={follower.profilePicture || "/default-profile.png"}
                        alt={`${follower.username}'s Profile`}
                        className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-blue-500 font-semibold">{follower.username}</span>
                    </li>
                    </a>
                ))}
             </ul>

        </div>

    </div>

    </>
  );
};

export default MessageList;
