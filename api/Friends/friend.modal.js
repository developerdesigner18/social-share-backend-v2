import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const friendSchema = Schema({
    userId:String,
    friendList:Array,
    getRequest:Array,
    sentRequest:Array
}, { timestamps: {createdAt:'created_at'} })

export const FriendList = mongoose.model('FriendDocument',friendSchema);