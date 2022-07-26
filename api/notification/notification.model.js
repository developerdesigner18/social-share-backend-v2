import mongoose, { Schema } from 'mongoose';
import timestamps from "mongoose-timestamp";

const notificationSchema = Schema({
    userId: String,
    notification: Array,
}, { timestamps: { createdAt: 'created_at' } })

export const notificationList = mongoose.model('notificationDocument', notificationSchema);
