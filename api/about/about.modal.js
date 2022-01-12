import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const aboutSchema = Schema({
    userId:String,
    work:Array,
    university:Array,
    highSchool:Array,
    mobileNumber:Number,
    address:String,
    website:String,
    socialLink:String,
    basicInfo:String,
    relationshipStatus:String,
    family:Array,
    aboutYourself:String,
    pronunciation:String,
    otherName:String,
    quote:String,
    bloodDonations:String,
    lifeEvents:Array,
    birthDate:String,
    language:Array,
    gender:String,
    currentCity:String,
    homeTown:String

}, { timestamps: {createdAt:'created_at'} })

export const about = mongoose.model('about',aboutSchema);