import React, { useState,useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import SearchModal from "../searchResultsModal/SearchResultsModal";
import SearchedUsers from "../searchUsers/SearchUsers";
import axios from "axios";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/users/find/${search}`);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
  
  })


  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-4 my-5 justify-center">
      <div className="mx-auto md:mx-0">
        <img
          src="/X-Logo.png"
          alt="twitter logo"
          width={"40px"}
          className="ml-8"
        />
      </div>

      <div className="col-span-2 md:border-x-2 mb:border-slate-200 md:px-6 my-6 md:my-0">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl">Home</h2>
          <StarBorderPurple500Icon />
        </div>
      </div>

      {/* <form >
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
      </form> */}
    </div>
    {/* {openModal && <SearchModal setOpen={setOpenModal} />} */}
    </>
  );
};

export default Navbar;
