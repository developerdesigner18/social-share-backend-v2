import express from "express";
import {
    getProfile,
    serachUser,
    updateUser,
    setProfileImg,
    setCoverImg,
    updateName,
    updateStatus,
    insertTheme,
    changechatStatus,
    getUserMonthdata
} from './user.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import configKey from '../../config'
import jwt from 'jsonwebtoken';
import { Users } from "./user.modal";
import { decode } from "querystring";
export const userRouter = express.Router();

var pstorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const profileUploadDir = path.join(__dirname, '..', '..', 'public', 'profile');
        if (fs.existsSync(profileUploadDir)) {
            cb(null, profileUploadDir)
        }
        else {
            fs.mkdirSync(profileUploadDir, { recursive: true })
            cb(null, profileUploadDir)
        }
    },
    filename: async function (req, file, cb) {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        cb(null, data._id + '.' + extension)
    }
})

var cstroge = multer.diskStorage({
    destination: async function (req, file, cb) {
        const { userId } = req.body;
        const coverUploaddir = path.join(__dirname, '..', '..', 'public', 'cover');
        if (fs.existsSync(coverUploaddir)) {
            cb(null, coverUploaddir)
        }
        else {
            fs.mkdirSync(coverUploaddir, { recursive: true })
            cb(null, coverUploaddir)
        }
    },
    filename: async function (req, file, cb) {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        cb(null, data._id + '.' + extension)
    }
})
const uploadCoverImg = multer({
    storage: cstroge,
    fileFilter: async function (req, file, cb) {
        try {
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);

            const data = await Users.findOne({ emailId: decoded.sub })
            data.coverImgURl = "";
            const extension = data.coverImgURl.substring(data.coverImgURl.lastIndexOf(".") + 1);
            const coverUploaddir = path.join(__dirname, '..', '..', 'public', 'cover');

            if (fs.existsSync(coverUploaddir + '/' + data._id + '.' + extension)) {
                fs.unlink(coverUploaddir + '/' + data._id + '.' + extension, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }
            cb(null, true);
        }
        catch (err) {
            cb(null, false, new Error(err.message));
        }

    }
})
const uploadProfileImg = multer({
    storage: pstorage,
    fileFilter: async function (req, file, cb) {
        try {
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const data = await Users.findOne({ emailId: decoded.sub })
            data.profileImgURl = "";
            const extension = data.profileImgURl.substring(data.profileImgURl.lastIndexOf(".") + 1);
            const profileUploadDir = path.join(__dirname, '..', '..', 'public', 'profile');

            if (fs.existsSync(profileUploadDir + '/' + data._id + '.' + extension)) {
                fs.unlink(profileUploadDir + '/' + data._id + '.' + extension, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }
            cb(null, true);
        }
        catch (err) {
            cb(null, false, new Error(err.message));
        }

    }
})

userRouter.post('/setprofileimg', uploadProfileImg.single('image'), setProfileImg);
userRouter.post('/setcoverimg', uploadCoverImg.single('image'), setCoverImg);
userRouter.get('/profile', getProfile);
userRouter.post('/serach', serachUser);
userRouter.post('/update', updateUser);
userRouter.post('/updateprofile', updateName);
userRouter.post('/status', updateStatus);
userRouter.post('/theme', insertTheme);
userRouter.post('/changechatStatus', changechatStatus)
userRouter.post('/getUserMonthData', getUserMonthdata)
