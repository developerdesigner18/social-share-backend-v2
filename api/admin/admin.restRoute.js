import express from 'express'
import {
    getUsersList,
    getPostsList,
    getCommunityPost,
    deletePost
} from './admin.controller'

export const adminRouter = express.Router();

adminRouter.get("/getAllUsers", getUsersList)
adminRouter.get("/getAllPosts", getPostsList)
adminRouter.get("/getAllCommunityPosts", getCommunityPost)
adminRouter.post("/deletecommunityPost", deletePost)


