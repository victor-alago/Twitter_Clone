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
      state.currentUser.profilePicture = action.payload.profilePicture;
      state.currentUser.firstname = action.payload.firstname;
      state.currentUser.lastname = action.payload.lastname;
      state.currentUser.bio = action.payload.bio;
    },

    followUser: (state, action) => {
      // if the username that is passed from the payload is not in the following list  of the current user
      if (state.currentUser.following.includes(action.payload)) {
        state.currentUser.following.splice(
          state.currentUser.following.findIndex(
            (followingId) => followingId === action.payload
          )
        );
      } else {
        state.currentUser.following.push(action.payload);
      }
    },
  },

});


// export the actions
export const { loginStart, loginSuccess, loginFailed, logout, updateProfile, followUser} =
  userSlice.actions;




export default userSlice.reducer;
