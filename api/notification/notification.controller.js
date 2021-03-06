import { notificationList } from './notification.model'
import { Users } from '../users/user.model'
import jwt from 'jsonwebtoken';
import configKey from '../../config'
//------------------------------------------------------------------show notification

export const getnotification = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await notificationList.findOne({ userId: userId })
        if (userData !== null) {
            const notificationData = userData.notification
            if (notificationData.length > 0) {
                res.status(201).send({
                    success: true,
                    message: notificationData.reverse()
                })
            } else {
                res.status(201).send({
                    code: 401,
                    success: false,
                    message: "You don't have any notification yet."
                })
            }
        } else {
            res.status(201).send({
                code: 401,
                success: false,
                message: "You don't have any notification yet."
            })
        }
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}
