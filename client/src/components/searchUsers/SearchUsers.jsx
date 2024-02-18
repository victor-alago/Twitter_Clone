// // import React, { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // // Import the followUser action creator from Redux
// // import { followUser } from "../../redux/userSlice";
// // import SearchModal from "../searchModal/SearchModal";
// // import axios from "axios";


// // const SearchedUsers = ({ users }) => {
// //   const dispatch = useDispatch();
// //   const { currentUser } = useSelector((state) => state.user);

// //   // Function to handle the follow button click
// //   const handleFollow = async (username) => {
// //     if (!currentUser.following.includes(username)) {
// //       try {
// //         const follow = await axios.put(`/users/follow/${username}`);
// //         dispatch(followUser(username));
// //         // console.log(follow.data);
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     } else {
// //       try {
// //         const unfollow = await axios.put(`/users/unfollow/${username}`);
// //         dispatch(followUser(username));
// //         // console.log(unfollow.data);
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     }
// //     // Dispatch the followUser action with the username as payload
// //   };
// //   // useEffect(() => {
// //   //   const fetchUsers = async () => {
// //   //     try {
// //   //       const res = await axios.get(`/users?username=${search}`);
// //   //       setUsers(res.data);
// //   //     } catch (err) {
// //   //       console.log(err);
// //   //     }
// //   //   };
// //   // })

// //   return (
// //     <div>
// //       <h2>Searched Users</h2>
// //       <ul>
// //         {/* Map over the array of users and display each username along with a follow button */}
// //         {users.map((user) => (
// //           <li key={user.username}>
// //             {/* Display the username */}
// //             <span>{user.username}</span>
// //             {/* Follow button */}
// //             <button
// //               className="bg-blue-500 text-white rounded-full px-4 py-2"
// //               onClick={() => handleFollow(user.username)}
// //             >
// //               Follow
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default SearchedUsers;
// import React, { useState } from "react";

// const SearchUser = ({ handleSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSearch(searchTerm);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Search for a user..."
//         value={searchTerm}
//         onChange={handleChange}
//       />
//       <button type="submit">Search</button>
//     </form>
//   );
// };

// export default SearchUser;
