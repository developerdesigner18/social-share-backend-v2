import express from 'express'
import {
    insertMsg,
    showMsg,
    updateMsg,
    showstatusMsg
} from './chat.controller'
export const chatRouter = express.Router();

chatRouter.post("/insertMsg", insertMsg)
chatRouter.get("/showMsg", showMsg)
chatRouter.post("/updateMsg", updateMsg)
chatRouter.get("/showstatusMSG", showstatusMsg)