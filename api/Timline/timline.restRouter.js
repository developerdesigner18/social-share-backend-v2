import express from 'express'
import {
    getTimeline,
    setTimeline
} from './timline.controller'
export const timelineRouter = express.Router();

timelineRouter.get("/",getTimeline);
timelineRouter.post("/send",setTimeline);
