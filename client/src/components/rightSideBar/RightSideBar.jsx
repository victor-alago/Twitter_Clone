import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SearchModal from "../searchResultsModal/SearchResultsModal";
import TrendingHashtags from "../trendingHashtags/TrendingHashtags";
// import SearchedUsers from "../searchUsers/SearchUsers";
import axios from "axios";

const RightSideBar = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  // handleSearch function will make a get request to the server to search for a user
  useEffect(() => {
    const handleSearch = async () => {
      try {
        // console.log(search);
        const res = await axios.get(`/users/search/${search}`);
        setSearchResults(res.data);
        // setOpenModal(true);
      } catch (err) {
        console.log(err);
      }
    };
    handleSearch();
  }, [search]);

  // when the user sublits the form, the handleSearch function will be called
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="mt-10">
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

      {openModal && (
        <SearchModal setOpen={setOpenModal} users={searchResults} />
      )}

      <div className="mt-8">
        <TrendingHashtags />
      </div>

      
    </>
  );
};

export default RightSideBar;

