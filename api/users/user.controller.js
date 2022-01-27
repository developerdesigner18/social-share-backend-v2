import { Users } from './user.modal'
import mongoose from 'mongoose'
import configKey from '../../config'
import jwt from 'jsonwebtoken';
var _ = require('lodash');

// get user profile by id
export const getProfile = async (req, res) => {
    try {
        const userId = req.query.id;
        const profileData = await Users.findById(userId)
        if (profileData.length <= 0) {
            res.status(401).send({
                success: false,
                message: 'somthing goes to wrong in find data'
            })
        }
        else {
            res.status(201).send({
                success: true,
                data: profileData,
                message: 'data find successfully'
            })
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}
//search User
export const serachUser = async (req, res) => {
    try {
        const { serchData, userId } = req.body;
        const searchDataBackend = []
        const allUser = await Users.aggregate([{
            $match: {}
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                profileImgURL: 1,
                city: 1
            }
        }]);
        await Promise.all(allUser.map((item) => {
            const ID = item._id.toString();
            if (item.userName.match(serchData) && !ID.match(userId)) {
                searchDataBackend.push(item);
            }
        }))
        res.status(201).send({
            success: true,
            data: searchDataBackend
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}
//edit profile page
export const updateUser = async (req, res) => {
    try {
        const { userId, designation, country, state, city, hobbies, intro } = req.body;
        const success = await Users.findByIdAndUpdate({ _id: userId }, {
            designation, country, state, city, hobbies, intro
        })
        if (!success) {
            res.status(401).send({
                success: false,
                message: 'data update process failed due to user not found error'
            })
        }
        res.status(201).send({
            success: true,
            message: 'data update successsully'
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//live status
export const updateStatus = async (req, res) => {
    console.log("req", req)
    const userId = req.userId
    const content = req.status
    await Users.findByIdAndUpdate({ _id: userId }, { content: content })
}

//Theme insert
export const insertTheme = async (req, res) => {
    try {
        const userId = req.body.id
        const data = req.body.data
        const success = await Users.findByIdAndUpdate({ _id: userId }, { theme: data })
        if (!success) {
            res.status(401).send({
                success: false,
                message: 'Data not inserted in theme'
            })
        }
        res.status(201).send({
            success: true,
            message: 'Data inserted successfully'
        })
    } catch (error) {
        res.status(401).send({
            success: false,
            message: error
        })
    }
}

//name and username page
export const updateName = async (req, res) => {
    try {
        const { userId, name, userName, designation, country, state, city, hobbies } = req.body;
        var userdata = await Users.findById({ _id: userId }, { created_at: 0, updatedAt: 0, createdAt: 0 })

        var profileData = _.extend(userdata, req.body);

        const success = await Users.findByIdAndUpdate({ _id: userId }, profileData)
        if (!success) {
            res.status(401).send({
                success: false,
                message: 'data update process failed due to user not found error'
            })
        }
        res.status(201).send({
            success: true,
            message: 'data update successsully'
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//change chat status
export const changechatStatus = async (req, res) => {
    try {
        var userId = req.body.userId
        var status = req.body.status

        const success = await Users.findByIdAndUpdate({ _id: userId }, { chatStatus: status })
        if (!success) {
            res.status(401).send({
                success: false,
                message: 'data update process failed due to user not found error'
            })
        }
        res.status(201).send({
            success: true,
            message: 'data update successsully'
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}
//upload profile Image
export const setProfileImg = async (req, res) => {
    try {
        if (req.file) {
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const URL =
                (process.env.NODE_ENV === "development") ? "http://localhost:8000/profile/" : "http://159.203.67.155:8000/profile/";
            await Users.findOneAndUpdate({ emailId: decoded.sub }, {
                profileImgURl: URL + req.file.filename
                // profileImgURl:"http://159.203.67.155:8000/profile/"+req.file.filename
            })
            return res.status(201).send({
                success: true,
                message: 'image upload successfully'
            })
        }
        else {
            res.status(401).send({
                success: false,
                message: "Image file either not supported or not found"
            })
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//upload Cover Image
export const setCoverImg = async (req, res) => {
    try {
        if (req.file) {
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const URL =
                (process.env.NODE_ENV === "development") ? "http://localhost:8000/cover/" : "http://159.203.67.155:8000/cover/";
            await Users.findOneAndUpdate({ emailId: decoded.sub }, {
                coverImgURl: URL + req.file.filename
                // coverImgURl:"http://159.203.67.155:8000/cover/"+req.file.filename
            })
            return res.status(201).send({
                success: true,
                message: 'image upload successfully'
            })
        }
        else {
            res.status(401).send({
                success: false,
                message: "Image file either not supported or not found"
            })
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

// getMonthUser data
export const getUserMonthdata = async (req, res) => {
    try {
        const allUser = await Users.aggregate([{
            $match: {}
        },
        {
            $project: {
                _id: 1,
                createdAt: 1
            }
        }])
        const promise = new Promise((resolve, reject) => {
            if (allUser.length > 0) {
                let date_d = []
                for (var i = 0; i < 12; i++) {
                    var d = new Date(req.body.date, i + 1, 1)
                    date_d.push(d.toISOString().substring(0, 7))
                }
                let reduced = date_d.map(a => {
                    return {
                        userCount: allUser.filter(a1 => a1.createdAt.toISOString().startsWith(a)).length,
                        createdAt: a
                    }
                }
                )
                resolve(reduced)
            } else {
                reject("error")
            }
        })

        promise.then((resa) => {
            res.send({ status: true, length: allUser.length, reduced: resa, chartData: resa.map(a => a.userCount) })
        }).catch((err) => {
            res.send(err)
        })

    } catch (err) {
        res.send(err)
    }
}
