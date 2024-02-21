import React from "react";
import CreateTweet from "../createTweet/CreateTweet";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const CreateTweetModal = ({ setOpen }) => {
  return (
    <div className="absolute w-full h-full top-0 left-0 bg-blur flex items-center justify-center z-20">
      <div className="relative w-[500px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4">
        <button
          className="absolute top-3 right-3 cursor-pointer text-red-500"
          onClick={() => setOpen(false)} 
        >
          <CloseRoundedIcon />
        </button>

        <CreateTweet />
      </div>
    </div>
  );
};

export default CreateTweetModal;
