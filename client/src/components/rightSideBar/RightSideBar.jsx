import React, { useState,useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SearchModal from "../searchResultsModal/SearchResultsModal";
// import SearchedUsers from "../searchUsers/SearchUsers";
import axios from "axios";

const RightSideBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

// handleSearch function will make a get request to the server to search for a user
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/users/find/${search}`);
      setSearchResults(res.data);
      setOpenModal(true);
    } catch (err) {
      console.log(err);
    }
  }

// when the user sublits the form, the handleSearch function will be called
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSearch();
  }
  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
          <div className="px-0 md:px-6 mx-auto">
            <SearchIcon className="absolute m-2" />
            <input
              type="text"
              placeholder="Search for a user"
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setOpenModal(true)}
              className="bg-blue-100 rounded-full py-2 px-8"
            />
          </div>
        </form>
      </div>
    {/* {openModal && <SearchModal setOpen={setOpenModal} users={searchResults}/>} */}

    {/* <div>
      <SearchedUsers users={users} />
    </div> */}
    </>
  )
}

export default RightSideBar

// import React, { useState, useEffect } from "react";
// import SearchUser from "../searchUsers/SearchUsers";
// import SearchResultsModal from "../searchResultsModal/SearchResultsModal";
// import axios from "axios";

// const RightSideBar = () => {
//   const [searchResults, setSearchResults] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const handleSearch = async (searchTerm) => {
//     try {
//       const res = await axios.get(`/users/find/${searchTerm}`);
//       setSearchResults(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     if (searchResults.length > 0) {
//       setShowModal(true);
//     }
//   }, [searchResults]);

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div>
//       <SearchUser handleSearch={handleSearch} />
//       {showModal && (
//         <SearchResultsModal
//           results={searchResults}
//           handleClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default RightSideBar;

