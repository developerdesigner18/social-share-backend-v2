import { ChatList } from './chat.modal'
import { Users } from '../users/user.modal'
import jwt from 'jsonwebtoken';
import configKey from '../../config'
import mongoose from 'mongoose'


//Insert message
export const insertMsg = async (req, res) => {
    try {
        const { message, sender, senderID, recieverID, mergeId, status } = req.body;
        await ChatList.create({
            message,
            sender,
            senderID,
            recieverID,
            mergeId,
            status
        })
        return res.status(201).send({
            success: true,
            message: "successfully."
        });
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}

//show mwssages
export const showMsg = async (req, res) => {
    try {
        const mergeId = req.query.mergeId
        const data = await ChatList.find({ mergeId: mergeId });
        if (!data) {
        }
        res.status(201).send({
            success: true,
            message: 'data fetched successfully',
            userData: data
        })
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}

//update mwssages
export const updateMsg = async (req, res) => {
    try {
        const id = req.body.id
        const data = await ChatList.findByIdAndUpdate({ _id: id }, { status: 1 });
        if (!data) {
            console.log("data not found");
        }
        res.status(201).send({
            success: true,
            message: 'Update successfully'
        })
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}

// show all 0 status message
export const showstatusMsg = async (req, res) => {
    try {
        const data = await ChatList.find({ status: 0 });
        if (!data) {
            console.log("data not found");
        }
        res.status(201).send({
            success: true,
            message: 'Data fetch successfully',
            data: data
        })
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}