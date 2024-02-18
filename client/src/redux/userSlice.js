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
      const { profilePicture,bannerPicture, firstname, lastname, bio } = action.payload;
      state.currentUser = {
        ...state.currentUser,
        profilePicture: profilePicture,
        bannerPicture: bannerPicture,
        firstname: firstname,
        lastname: lastname,
        bio: bio,
      };
    },

    updateEmail: (state, action) => {
      if (state.currentUser) {
        state.currentUser.email = action.payload.email;
      }
    },

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
          ? // get everyone that is not the provided username
            state.currentUser.following.filter(
              (followingId) => followingId !== username
            )
          : // else add the username to the following array
            [...state.currentUser.following, username],
      };
    },

  },
});

// export the actions
export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateProfile,
  followUser,
  updateEmail,
} = userSlice.actions;

export default userSlice.reducer;