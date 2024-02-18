import mongoose, { Schema } from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim : true,
            max: 280,
        },
        media: {
            type: String,
            default: "",
        },
        likes: {
            type: Array,
            default: []
        },
        retweets: {
            type: Array,
            default: []
        },
        comments: {
            type: Array,
            default: []
        },
        bookmarks: {
            type: Array,
            default: []
        },
    },
    { timestamps: true },
);

export default mongoose.model("Tweet", tweetSchema);