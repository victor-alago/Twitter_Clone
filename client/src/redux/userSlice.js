import { createSlice } from "@reduxjs/toolkit";

// create an initial user state
const initialState = {
  currentUser: null,
  isLoading: false,
  error: false,
};

// create a user slice
export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },

    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },

    loginFailed: (state) => {
      state.isLoading = false;
      state.error = true;
    },

    logout: (state) => {
      return initialState;
    },

    updateProfile: (state, action) => {
      const { profilePicture, firstname, lastname, bio } = action.payload;
      state.currentUser = {
        ...state.currentUser,
        profilePicture: profilePicture,
        firstname: firstname,
        lastname: lastname,
        bio: bio,
      }
    },

    // followUser: (state, action) => {
    //   // if the username that is passed from the payload is not in the following list  of the current user
    //   if (state.currentUser.following.includes(action.payload)) {
    //     state.currentUser.following.splice(
    //       state.currentUser.following.findIndex(
    //         (followingId) => followingId === action.payload
    //       )
    //     );
    //   } else {
    //     state.currentUser.following.push(action.payload);
    //   }
    // },

    followUser: (state, action) => {
      //  get username to follow or unfollow from the payload
      const username = action.payload;
      // check if the current user is already following the user (username is in following array)
      const isFollowing = state.currentUser.following.includes(username);
      // return the new state
      state.currentUser = {
        //previous state
        ...state.currentUser,
        // update the following array based on the isFollowing value
        following: isFollowing
        // get everyone that is not the provided username
        ? state.currentUser.following.filter((followingId) => followingId !== username)
        // else add the username to the following array
        : [...state.currentUser.following, username]
      }
    },

    followUserFailed: (state, action) => {

    },
  },
});

// export the actions
export const { loginStart, loginSuccess, loginFailed, logout, updateProfile, followUser} =
  userSlice.actions;

export default userSlice.reducer;
