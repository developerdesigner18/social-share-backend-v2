import express from 'express'
import { userRouter } from './users'
import { friendRouter } from './Friends'
import { photosRouter } from './photos'
import { notificationRouter } from './notification/notification.restRoute';
import { aboutRouter } from './about'
import { chatRouter } from './chat'
import { adminRouter } from './admin'

export const restRouter = express.Router();
restRouter.use('/user', userRouter)
restRouter.use('/friend', friendRouter)
// restRouter.use('/matirial',materialRouter);
restRouter.use('/photos', photosRouter)
restRouter.use('/notification', notificationRouter)
restRouter.use('/about', aboutRouter)
restRouter.use('/chat', chatRouter)
restRouter.use('/admin', adminRouter)
