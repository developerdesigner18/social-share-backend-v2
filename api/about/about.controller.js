import { Users } from '../users/user.modal'
import { notificationList } from '../notification/notification.modal'
import { about } from './about.modal'
import jwt from 'jsonwebtoken';
import configKey from '../../config'
import mongoose from 'mongoose'

const checkUserData = async (user) => {
    const userFind = await about.find({ userId: user });
    if (userFind <= 0) {
        await about.create({
            userId: user
        })
    }
}
const addData = async (user, data, column) => {
    await about.findOneAndUpdate({ userId: user }, {
        $push: { [column]: data }
    })
}
const updateData = async (user, dataId, data, updateId) => {
    await about.updateOne({ userId: user, [updateId]: mongoose.Types.ObjectId(dataId) }, {
        $set: data
    })
}
const deleteData = async (user, column, dataId) => {
    await about.findOneAndUpdate({ userId: user }, {
        $pull: { [column]: { _id: mongoose.Types.ObjectId(dataId) } }
    })
}
//-------------------------------------------------------------------work--------------------------------------------------------------------
//add work in user about
export const addWork = async (req, res) => {
    try {
        const { userId } = req.body;
        const { company, position, city, description, fromdate, todate } = req.body
        var data = { _id: mongoose.Types.ObjectId(), company: company, position: position, city: city, description: description, fromdate: fromdate, todate: todate };

        checkUserData(userId);
        const userdata = await about.findOne({ userId: userId })
        addData(userId, data, "work");

        res.status(201).send({
            success: true,
            message: 'work add successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//update work in user about
export const updateWork = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        const { company, position, city, description, fromdate, todate } = req.body
        var data = { 'work.$.company': company, 'work.$.position': position, 'work.$.city': city, 'work.$.description': description, 'work.$.fromdate': fromdate, 'work.$.todate': todate };
        updateData(userId, dataId, data, 'work._id')
        res.status(201).send({
            success: true,
            message: 'update work successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//delete work in user about
export const deleteWork = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        deleteData(userId, "work", dataId)
        res.status(201).send({
            success: true,
            message: 'delete work successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//------------------------------------------------high school---------------------------------------------------------------------------------
//add HighSchool in user about
export const addHighSchool = async (req, res) => {
    try {
        const { userId } = req.body;
        const { name, description, fromdate, todate } = req.body
        var data = { _id: mongoose.Types.ObjectId(), name: name, description: description, fromdate: fromdate, todate: todate };

        checkUserData(userId);
        const userdata = await about.findOne({ userId: userId })
        addData(userId, data, "highSchool");

        res.status(201).send({
            success: true,
            message: 'highSchool data add successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
// update work in user about
export const updateHighSchool = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        const { name, description, fromdate, todate } = req.body
        var data = { 'highSchool.$.name': name, 'highSchool.$.description': description, 'highSchool.$.fromdate': fromdate, 'highSchool.$.todate': todate };
        updateData(userId, dataId, data, 'highSchool._id')
        res.status(201).send({
            success: true,
            message: 'update highSchool data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//delete work in user about
export const deleteHighSchool = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        deleteData(userId, "highSchool", dataId)
        res.status(201).send({
            success: true,
            message: 'delete highSchool data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//------------------------------------------------family member---------------------------------------------------------------------------------
//add HighSchool in user about
export const addFamilyMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const { name, relationship } = req.body
        var data = { _id: mongoose.Types.ObjectId(), name: name, relationship: relationship };

        checkUserData(userId);
        const userdata = await about.findOne({ userId: userId })
        addData(userId, data, "family");

        res.status(201).send({
            success: true,
            message: 'family member add successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
// update work in user about
export const updateFamilyMember = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        const { name, relationship } = req.body
        var data = { 'family.$.name': name, 'family.$.relationship': relationship };
        updateData(userId, dataId, data, 'family._id')
        res.status(201).send({
            success: true,
            message: 'update family data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//delete work in user about
export const deleteFamilyMember = async (req, res) => {
    try {
        const { userId, dataId } = req.body;
        deleteData(userId, "family", dataId)
        res.status(201).send({
            success: true,
            message: 'delete family member data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}

//-------------------------------------------------------single String add -----------------------------------------------------------------------
async function aboutMe(userid, key, value) {
    var data = await about.find({ userId: userid })
    if (data.length != 0) {
        await about.findOneAndUpdate({ userId: userid }, {
            $set: { [key]: value }
        })
    } else {
        await about.create({ userId: userid, [key]: value })
    }
}
async function deleteAboutMe(userid, key, value) {
    console.log(key);
    await about.findOneAndUpdate({ userId: userid }, {
        $unset: { [key]: value }
    })
}

export const updateAbout = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const user = await Users.findOne({ emailId: decoded.sub })

        const userId = user._id;
        console.log(user._id);
        const info = req.body;
        console.log(userId);
        console.log(info);
        var key = Object.keys(info)[0]
        var value = Object.values(info)[0]
        console.log(key, value);

        aboutMe(userId, key, value);

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

export const deleteAbout = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const user = await Users.findOne({ emailId: decoded.sub })
        const userId = user._id;
        const info = req.body;
        console.log(userId);
        var key = Object.keys(info)[0]
        var value = Object.values(info)[0]
        deleteAboutMe(userId, key, key, value);
        res.status(201).send({
            success: true,
            message: 'data delete successsully'
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

// get about data
export const getAboutData = async (req, res) => {
    try {
        // const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        // const user = await Users.findOne({emailId:decoded.sub})
        // const userid = user._id
        const userid = req.query.userid
        // const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await about.find({ userId: userid });
        if (!data) {
            console.log("data not found");
            res.status(201).send({
                code: 401,
                success: false,
                message: "You don't have any data",
            });
        }
        if (data.length != 0) {
            res.status(201).send({
                success: true,
                message: 'data fetched successfully',
                userData: data
            })
        } else {
            res.status(201).send({
                code: 401,
                success: false,
                message: "You don't have any data",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}

// add single value array-------------------------------------------------------------------
//add in user about
export const addSingleArray = async (req, res) => {
    try {
        const { userId, fieldName } = req.body;
        const { name } = req.body
        var data = { _id: mongoose.Types.ObjectId(), name: name, date: new Date() };
        checkUserData(userId);
        const userdata = await about.findOne({ userId: userId })
        addData(userId, data, fieldName);
        res.status(201).send({
            success: true,
            message: 'data add successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
// update in user about
export const updateSingleArray = async (req, res) => {
    try {
        const { userId, dataId, fieldName } = req.body;
        const { name } = req.body
        var data = JSON.parse('{' + '"' + `${fieldName}.$.name` + '":"' + name + '"}');
        updateData(userId, dataId, data, `${fieldName}._id`)
        res.status(201).send({
            success: true,
            message: 'update data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}
//delete in user about
export const deleteSingleArray = async (req, res) => {
    try {
        const { userId, dataId, fieldName } = req.body;
        deleteData(userId, fieldName, dataId)
        res.status(201).send({
            success: true,
            message: 'delete data successfully',
        })
    }
    catch (err) {
        res.status(401).send({
            success: false, message: err.message
        });
    }
}