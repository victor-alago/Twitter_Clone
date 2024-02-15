import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, logout } from "../../redux/userSlice";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNavigate } from "react-router-dom";


const EditProfile = ({ setOpen }) => {
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  // const [banner, setBanner] = useState(null);
  // const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [bio, setBio] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const { currentUser } = useSelector((state) => state.user);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle user update
  const updateUser = () => {
    try {
      axios.put(`/users/${currentUser.username}`, {
        profilePicture: img,
        firstname: firstname,
        lastname: lastname,
        bio: bio,
      });
      dispatch(updateProfile(updateUser));
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImg = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
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
        // Upload completed successfully, now we can get the download URL and update the state
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImg(downloadURL);
          
        });
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      const deleteUser = await axios.delete(`/users/${currentUser.username}`);
      dispatch(logout());
      navigate("/login");
      console.log(deleteUser);
    } catch (error) {
      console.log(error);
    }
  }

  //upload file to firebase storage when file state changes
  // get the download url and update the state
  useEffect(() => {
    file && uploadImg(file);
  }, [file]);

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-blur flex items-center justify-center">
      <div className="relative w-[500px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4">
        <button
          className="absolute top-3 right-3 cursor-pointer text-red-500"
          onClick={() => setOpen(false)}
        >
          <CloseRoundedIcon />
        </button>

        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <p>Upload profile picture</p>
        {imgUploadProgress > 0 ? "Uploading " + imgUploadProgress + "%" : null}
        <input
          type="file"
          className="bg-transparent border border-slate-500 rounded p-2"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />

        <input
          type="text"
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Firstname"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Lastname"
          onChange={(e) => setLastname(e.target.value)}
        />

        <input
          type="text"
          className="bg-transparent border border-slate-500 rounded p-2"
          placeholder="Bio"
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white rounded-full px-4 py-2"
            onClick={updateUser}
          >
            Save
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white rounded-full px-4 py-2"
            onClick={handleDeleteUser}
          >
            Delete account
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default EditProfile;
