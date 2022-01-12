import mongoose, { Schema } from 'mongoose';
import timestamps from "mongoose-timestamp";

const chatSchema = Schema({
    message: {
        type: String
    },
    sender: {
        type: String
    },
    senderID: {
        type: String
    },
    recieverID: {
        type: String
    },
    mergeId: {
        type: String
    },
    status: {
        type: Number
    }
}, { timestamps: { createdAt: 'created_at' } })

export const ChatList = mongoose.model('ChatDocument', chatSchema);