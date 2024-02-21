// EditProfile.jsx
import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, logout } from "../../redux/userSlice";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ setOpen }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [bio, setBio] = useState(currentUser.bio);
  const [firstname, setFirstname] = useState(currentUser.firstname);
  const [lastname, setLastname] = useState(currentUser.lastname);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateUser = async (profilePictureUrl, bannerPictureUrl) => {
    try {
      // Initialize an object to hold the updates
      let updates = {};
  
      // Only add fields to the updates object if they have a non-empty value
      if (profilePictureUrl) updates.profilePicture = profilePictureUrl;
      if (bannerPictureUrl) updates.bannerPicture = bannerPictureUrl;
      if (firstname.trim()) updates.firstname = firstname;
      if (lastname.trim()) updates.lastname = lastname;
      if (bio.trim()) updates.bio = bio;
  
      // Make the PUT request with the updates object
      const updatedUserResponse = await axios.put(
        `/users/${currentUser.username}`,
        updates, // Pass the updates object
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Adjust based on how you store and use tokens
          },
        }
      );
  
      // Update the Redux store with the response data
      const updatedUserData = updatedUserResponse.data;
      dispatch(
        updateProfile({
          ...currentUser,
          ...updates, // Use the updates object to ensure only updated fields are passed
        })
      );
  
      setOpen(false);
      // Optionally, navigate to the updated profile or show a success message
    } catch (error) {
      console.error("Failed to update user profile:", error);
      // Handle the error, e.g., through a notification to the user
    }
  };
  
    

  const handleSave = async () => {
    let profilePictureUrl = currentUser.profilePicture;
    let bannerPictureUrl = currentUser.bannerPicture; // Assuming you have a bannerPicture field in your user model
  
    if (file) {
      profilePictureUrl = await uploadImg(file, setImgUploadProgress); // Modify uploadImg to accept a progress setter function
    }
  
    if (bannerFile) {
      bannerPictureUrl = await uploadImg(bannerFile, setBannerUploadProgress); // Reuse uploadImg for banner file upload
    }
  
    // After getting the URLs or if there's no file, call updateUser
    updateUser(profilePictureUrl, bannerPictureUrl);
  };
  

  const uploadImg = (file, setUploadProgress) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Ensure unique file name
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress)); // Update progress
        },
        (error) => {
          console.error("Image upload error:", error);
          reject(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Resolve the promise with the download URL
          });
        }
      );
    });
  };
  

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-blur flex items-center justify-center pt-[100px]">
      <div className="relative w-[500px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4">
        <button className="absolute top-7 right-3 cursor-pointer text-red-500" onClick={() => setOpen(false)}>
          <CloseRoundedIcon />
        </button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p>Upload profile picture</p>
        {imgUploadProgress > 0 && <p>Uploading profile picture: {imgUploadProgress}%</p>}
        <input
          type="file"
          className="bg-transparent border border-slate-500 rounded p-2"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p>Upload banner picture</p>
        {bannerUploadProgress > 0 && <p>Uploading banner picture: {bannerUploadProgress}%</p>}
        <input
          type="file"
          className="bg-transparent border border-slate-500 rounded p-2"
          accept="image/*"
          // Use setBannerFile to store the selected file for the banner
          onChange={(e) => setBannerFile(e.target.files[0])}
        />

        <input
          type="text"
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <textarea
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="bg-blue-500 text-white rounded-full px-4 py-2" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
