import React from "react";
import { useSelector, useDispatch } from "react-redux";
// Import the followUser action creator from Redux
import { followUser } from "../../redux/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const username = user.username;

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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img
          src={
            user
              ? user.profilePicture || "default_profile_picture_url"
              : "default_profile_picture_url"
          }
          alt="Profile Picture"
          className="w-8 h-8 rounded-full object-cover"
        />

        <div>
          <Link to={`/profile/${user.username}`}>
            <h2 className="font-bold">
              {user.firstname} {user.lastname}
            </h2>
          </Link>
          <span className="font-normal">@{user.username}</span>
        </div>
      </div>

      {currentUser.following.includes(username) ? (
        <button
          onClick={handleFollow}
          className="bg-blue-500 text-white rounded-full py-1 px-2"
        >
          Following
        </button>
      ) : (
        // Otherwise, show "Follow" button
        <button
          onClick={handleFollow}
          className="bg-blue-500 text-white rounded-full py-1 px-2"
        >
          Follow
        </button>
      )}
    </div>
  );
};
//     <div className="flex justify-between">
//       <div>
//         <img
//           src={user && user.profilePicture}
//           alt="Profile Picture"
//           className="w-8 h-8 rounded-full object-cover"
//         />

//         <Link to={`/profile/${user.username}`}>
//           <h2 className="font-bold">
//             {user.firstname} {user.lastname}
//           </h2>
//         </Link>
//         <span className="font-normal">@{user.username}</span>
//       </div>

//       {currentUser.following.includes(username) ? (
//         <button
//           onClick={handleFollow}
//           className="bg-blue-500 text-white rounded-full p-2"
//         >
//           Following
//         </button>
//       ) : (
//         // Otherwise, show "Follow" button
//         <button
//           onClick={handleFollow}
//           className="bg-blue-500 text-white rounded-full p-1"
//         >
//           Follow
//         </button>
//       )}
//     </div>
//   );

// Remove the unnecessary closing curly brace
// };

export default User;
