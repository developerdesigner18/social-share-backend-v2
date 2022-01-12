import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const timlineSchema = Schema({
    userId:String,
    timeline:Array,
}, { timestamps: {createdAt:'created_at'} })

export const timelineList = mongoose.model('timelineDocument',timlineSchema);