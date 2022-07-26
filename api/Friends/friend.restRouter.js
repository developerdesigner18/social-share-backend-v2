import express from 'express'
import {
    sentFriendRequest,
    friendRequestAccept,
    getFriendList,
    rejectFriendRequest,
    suggestedFriend,
    allUser,
    AllSentRequest,
    showFriendRequetList,
    showRequestedFriEndData,
    allFriendsList,
    searchEngine,
    removeSendRequest,
    unFriend
} from './friend.controller'
export const friendRouter = express.Router();

friendRouter.get("/", allUser)
friendRouter.post("/send", sentFriendRequest)
friendRouter.post('/accept', friendRequestAccept)
friendRouter.get('/show', getFriendList)
friendRouter.post("/reject", rejectFriendRequest)
friendRouter.post('/suggest', suggestedFriend)
friendRouter.get("/sentRequests", AllSentRequest)
friendRouter.get('/requests', showFriendRequetList)
friendRouter.get('/requestsData', showRequestedFriEndData)
friendRouter.get("/allfriendList", allFriendsList)
friendRouter.get("/search", searchEngine)
friendRouter.post('/removeRequest', removeSendRequest)
friendRouter.post('/unFriend', unFriend)
