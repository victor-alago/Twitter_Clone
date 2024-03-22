import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import User from "../user/User";

const SearchModal = ({ setOpen, users }) => {
    return (
        <div className="absolute top-[calc(70px + 10px)] right-0 bg-blur flex items-start justify-end w-[calc(100vw - 20px)] z-[99]">
          <div className="relative w-[300px] bg-slate-400 rounded-lg p-8 flex justify-center flex-col gap-4">
            <button
              className="absolute top-8 right-3 cursor-pointer text-red-500"
              onClick={() => setOpen(false)}
            >
              <CloseRoundedIcon className="font-bold text-xl"/>
            </button>
            <>
              <h2 className="font-bold text-2xl">Search Results</h2>
              {users && users.length !== 0 ?(
                users.map((user) => (
                  <div key={user._id} className="p-2">
                    <User user={user} />
                  </div>
                ))
              ) : (
                <h2>No results found</h2>
              )}
            </>
          </div>
        </div>
      );
      
};

export default SearchModal;
