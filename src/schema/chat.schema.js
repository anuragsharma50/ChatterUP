import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }
})

export const chatModel = mongoose.model('chat',chatSchema);
