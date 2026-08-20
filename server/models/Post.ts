import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true
    },

    platforms: {
        type: [String],
        required: true
    },

    mediaUrl: {
        type: String
    },

    mediaType: {
        type: String,
        enum: ["image", "video", "audio"]
    },

    scheduledFor: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["scheduled", "posted", "failed"],
        default: "scheduled"
    }

}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);