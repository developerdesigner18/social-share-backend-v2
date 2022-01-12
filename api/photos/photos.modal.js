import mongoose, { Schema } from 'mongoose';
import timestamps from "mongoose-timestamp";

const photosSchema = Schema({
    userId: String,
    location: String,
    description: String,
    imageUrl: Array,
    askingPrice: Number,
    currentBid: Array,
    like: Array,
    comment: Array,
    share: Array,
    category: String,
    highBid: Number,
    city: String,
    state: String,
    name: String,
    valid: Date,
    type: String,
    status: Number

}, { timestamps: { createdAt: 'created_at' } })

export const photosList = mongoose.model('photosDocument', photosSchema);
