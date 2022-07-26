import express from 'express'
import {
    getTimeline,
    setTimeline
} from './timeline.controller'
export const timelineRouter = express.Router();

timelineRouter.get("/", getTimeline);
timelineRouter.post("/send", setTimeline);
