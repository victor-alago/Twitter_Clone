import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import app from "../../firebase"; 
import isVideoOrImage from "./fileCheck";
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';

const CreateTweet = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [file, setFile] = useState(null);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [userProfile, setUserProfile] = useState(null);
  const { username } = useParams();


  useEffect(() => {
    file && uploadMedia(file);
  }, [file]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userProfile = await axios.get(`/users/find/${username}`);
        setUserProfile(userProfile.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentUser, username]);

  // handle media upload
  const uploadMedia = (file) => {
    // Create a reference for the file
    const storage = getStorage(app);
    // check if the file given is either a picture or video then create fil
    const folder = isVideoOrImage(file) === "image" ? "images/" : "videos/"
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setMediaUploadProgress(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;

          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            // set the media url to the state
            setMedia(downloadURL);
            console.log(media);
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tweets/", { content: content, media: media });
      // IMPLEMENT SOCKET TO UPDATE TIMELINE
      // temporary solution
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-start space-x-4 pt-[20px]">
      {currentUser && (
        <img
            src={currentUser && currentUser.profilePicture ? currentUser.profilePicture : "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
      )}
      <form action="" className="flex-1 border-b-2 pb-6 flex flex-col">
      <textarea
        className="bg-transparent rounded-lg w-full p-2 text-lg focus:outline-none resize-none"
        type="text"
        maxLength={280}
        placeholder="What is happening?!"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {mediaUploadProgress > 0 && (
        <span>Uploading: {mediaUploadProgress}%</span>
      )}

      <div className="flex justify-between items-center mt-2">
        <label htmlFor="mediaInput" className="cursor-pointer text-blue-600 flex items-center">
          <InsertPhotoRoundedIcon />
          <input
            id="mediaInput"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full"
          onClick={handleSubmit}
        >
          Tweet
        </button>
      </div>
    </form>

    </div>
  );
};

export default CreateTweet;
