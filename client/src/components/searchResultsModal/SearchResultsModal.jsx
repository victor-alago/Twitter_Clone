// // import React, { useState } from "react";
// // import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// // import User from "../user/User";

// // const SearchModal = ({ setOpen, users}) => {
// //   // const [user, setUser] = useState(null);

// //   return (
// //     <div className="absolute w-full h-full top-0 left-0 bg-blur flex items-center justify-center">
// //       <div className="relative w-[300px] h-[300px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4">
// //         <button
// //           className="absolute top-3 right-3 cursor-pointer text-red-500"
// //           onClick={() => setOpen(false)}
// //         >
// //           <CloseRoundedIcon />
// //         </button>
// //         <h2>Search Results</h2>
// //         {users &&
// //         users.map((user) => {
// //           return (
// //             <div key={user._id} className="p-2">
// //               <User user={user} />
// //             </div>
// //           );
// //         })}
// //       </div>

// //     </div>
// //   );
// // };

// // export default SearchModal;

// // import React from "react";
// // import User from "../user/User";

// // const SearchResultsModal = ({ results, handleClose }) => {
// //   return (
// //     <div className="modal">
// //       <div className="modal-content">
// //         <span className="close" onClick={handleClose}>
// //           &times;
// //         </span>
// //         <h2>Search Results</h2>
// //         {results &&
// //           results.map((user) => {
// //             return (
// //               <div key={user._id} className="p-2">
// //                 <User user={user} />
// //               </div>
// //             );
// //           })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SearchResultsModal;

// import React from "react";

// const SearchResultsModal = ({ results, handleClose }) => {
//   // Check if results is an array before mapping over it
//   if (!Array.isArray(results) || results.length === 0) {
//     return (
//       <div className="modal">
//         <div className="modal-content">
//           <span className="close" onClick={handleClose}>
//             &times;
//           </span>
//           <h2>No results found</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={handleClose}>
//           &times;
//         </span>
//         <h2>Search Results</h2>
//         <ul>
//           {results.map((user) => (
//             <li key={user.id}>{user.name}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SearchResultsModal;

