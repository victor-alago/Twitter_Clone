import mongoose from "mongoose";

// create user schema
const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String, 
            required: [true, "Firstname is required"], 
            trim: true
        },
        lastname: {
            type: String, 
            required: [true, "Lastname is required"], 
            trim: true
        },
        username: {
            type: String, 
            required: [true, "Username is required"], 
            unique: [true, "Username is not available"],
            // lowercase: true,
            trim: true
        },
        email: {
            type: String, 
            required: [true, "Email is required"], 
            unique: [true, "Account with this email already exists"],
            trim: true,
            lowercase: true
        },
        password: {
            type: String, 
            required: [true, "Password is required"], 
            min: [6, "Password must be at least 6 characters long"],
            trim: true
        },

        profilePicture: {
            type: String
        },

        bannerPicture: {
            type: String
        },
        followers: {
            type: Array, 
            defaultValue: [] 
        },
        following: {
            type: Array, 
            defaultValue: [] 
        },
        bio: {
            type: String,
            defaultValue: "",
        }
    },
    {timestamps: true}
);

export default mongoose.model("User", UserSchema);