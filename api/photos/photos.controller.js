import { photosList } from './photos.modal'
import { Users } from '../users/user.modal'
import { FriendList } from '../Friends/friend.modal'
import { notificationList } from '../notification/notification.modal'
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import configKey from '../../config'
import mongoose from 'mongoose'
// import { photosRouter } from './photos.restRoute';
// import { isValidObjectId } from 'mongoose';

async function fname(data) {
    const usernotification = await notificationList.findOne({ userId: data })
    if (!usernotification) {
        await notificationList.create({
            userId: data,
            notificaton: []
        })
    }
}

export const showphotos = async (req, res) => {
    try {
        // const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        // const data = await Users.findOne({emailId:decoded.sub})
        // const userId = data._id

        const userId = req.query.id
        const postData = await photosList.find({ userId: userId })
        if (!postData) {
            console.log("user not found");
            res.status(201).send({
                success: false,
                message: 'post not found.'
            })
        }
        else if (postData.length > 0) {
            //   
            for (var s = 0; s < postData.length; s++) {
                const temp = []
                for (var h = 0; h < postData[s].imageUrl.length; h++) {
                    const t = { image: "", thumbImage: "", size: "" };
                    if (postData[s].imageUrl.length == 1) {
                        t['size'] = 100
                    }
                    else if (postData[s].imageUrl.length == 2 || postData[s].imageUrl.length >= 4) {
                        t['size'] = 50
                    }
                    else if (postData[s].imageUrl.length == 3) {
                        if (h == 0) {
                            t['size'] = 100
                        }
                        else {
                            t['size'] = 50
                        }
                    }

                    t['image'] = postData[s].imageUrl[h];
                    t['thumbImage'] = postData[s].imageUrl[h];
                    temp.push(t);
                }
                postData[s].imageUrl = temp

            }
            res.send(postData.reverse())
        }
        else {
            res.status(201).send({
                code: 404,
                success: false,
                message: "post not found.",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

export const showalbumphotos = async (req, res) => {
    try {
        const userId = req.query.userId
        const postData = await photosList.find({ $and: [{ userId: userId }, { name: { $not: { $eq: undefined } } }] })

        //check data fetched successfull or not
        if (!postData) {
            res.status(201).send({
                success: false,
                message: 'album not found.'
            })
        }

        if (postData.length > 0) {
            for (var i = 0; i < postData.length; i++) {
                var temp = []
                for (var j = 0; j < postData[i].imageUrl.length; j++) {
                    const t = { image: "", thumbImage: "" };
                    t['image'] = postData[i].imageUrl[j];
                    t['thumbImage'] = postData[i].imageUrl[j];
                    temp.push(t);
                }
                postData[i].imageUrl = temp
            }
            res.status(201).send({
                success: true,
                data: postData.reverse(),
            });
        }
        else {
            res.status(201).send({
                success: false,
                message: "Don't have any album.",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

// Delete album 
export const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.body
        const user = await photosList.findOneAndDelete({ _id: id }, (err, response) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: "oops! something wrong",
                });
            } else {
                if (response.imageUrl) {
                    response.imageUrl.forEach(element => {
                        let filePath = path.join(
                            __dirname,
                            "..",
                            "..",
                            "public",
                            "post",
                            element.split("/post/")[1]
                        );
                        fs.unlinkSync(filePath);
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: "successfully.",
                });
            }
        });
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

export const showAllphotosOnly = async (req, res) => {
    try {
        const userId = req.query.id
        const postData = await photosList.find({ userId: userId })
        // console.log("=-=-=-=-=-=-=-=-=", postData[0].imageUrl);
        //check data fetched successfull or not
        if (!postData) {
            res.status(201).send({
                success: false,
                message: 'No data to show'
            })
        }
        const temp = []
        if (postData.length != 0) {
            // const imgUrl = [];
            for (var i = 0; i < postData.length; i++) {

                for (var j = 0; j < postData[i].imageUrl.length; j++) {
                    const t = { image: "", thumbImage: "", order: "", status: "" };
                    // imgUrl.push(postData[i].imageUrl[j]);
                    t['image'] = postData[i].imageUrl[j];
                    t['thumbImage'] = postData[i].imageUrl[j];
                    t['order'] = j
                    t['status'] = postData[i].status
                    temp.push(t);
                }
                // postData[i].imageUrl = temp
            }
            res.status(201).send({
                success: true,
                data: temp,
            });
        }
        else {
            res.status(201).send({
                code: 401,
                success: false,
                message: "Don't have any photos",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

// based id fetch post
export const showphotosprofile = async (req, res) => {
    try {
        const userId = req.query.id
        const postData = await photosList.find({ userId: userId })
        if (!postData) {
            console.log("post data not found");
            res.status(201).send({
                success: false,
                message: 'No data to show'
            })
        }
        else if (postData.length > 0) {
            //   
            for (var s = 0; s < postData.length; s++) {
                const temp = []
                for (var h = 0; h < postData[s].imageUrl.length; h++) {
                    const t = { image: "", thumbImage: "", size: "", status: "" };
                    if (postData[s].imageUrl.length == 1) {
                        t['size'] = 100
                    }
                    else if (postData[s].imageUrl.length == 2 || postData[s].imageUrl.length >= 4) {
                        t['size'] = 50
                    }
                    else if (postData[s].imageUrl.length == 3) {
                        if (h == 0) {
                            t['size'] = 100
                        }
                        else {
                            t['size'] = 50
                        }
                    }

                    t['image'] = postData[s].imageUrl[h];
                    t['thumbImage'] = postData[s].imageUrl[h];
                    t['status'] = postData[s].status
                    temp.push(t);
                }
                postData[s].imageUrl = temp

            }
            res.send({
                success: true,
                data: postData.reverse()
            })
            // res.status(201).send({
            //     success: true,
            //     data: postData.reverse(),
            // });
        }
        else {
            res.status(201).send({
                code: 404,
                success: false,
                message: "post not found.",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//-------------------------------------------------- add new post
export const newPosts = async (req, res) => {
    try {
        console.log("req.body", req.body)
        const { location, description, askingPrice, category, name, type, status } = req.body;
        var imgFilesArray = [];
        const img = req.files;
        const URL =
            (process.env.NODE_ENV === "development") ? "http://localhost:8000/post/" : "http://159.203.67.155:8000/post/";
        img.forEach((element) => {
            var imgUrl = URL + element.filename;
            imgFilesArray.push(imgUrl);
        });
        // var imgUrl =  "http://159.203.67.155:8000/api/photos/"+img  //For server
        const decoded = await jwt.verify(
            req.headers.token,
            configKey.secrets.JWT_SECRET
        );
        const data = await Users.findOne({ emailId: decoded.sub });
        const userId = data._id;
        // const userId =req.body.userId
        var highBid = 0;
        var now = new Date();
        await photosList.create({
            name,
            userId,
            location,
            description,
            askingPrice,
            category,
            highBid,
            imageUrl: imgFilesArray,
            status
        });
        const friendData = await FriendList.findOne({ userId: userId });
        if (friendData) {
            const fList = friendData.friendList;
            for (var i = 0; i < fList.length; i++) {
                const usernotification = await notificationList.findOne({
                    userId: fList[i].friendId,
                });
                if (!usernotification) {
                    await notificationList.create({
                        userId: fList[i].friendId,
                        notificaton: [],
                    });
                }
                await notificationList.findOneAndUpdate(
                    { userId: fList[i].friendId },
                    {
                        $push: {
                            notification: {
                                type: "new post",
                                userPostId: userId,
                                userprofile: data.profileImgURl,
                                content: data.name + " has created new post",
                                phostImg: imgFilesArray,
                                date: now,
                            },
                        },
                    }
                );
            }
        }
        return res.status(201).send({
            success: true,
            message: "post created successfully.",
        });
    } catch (err) {
        res.status(422).send({ success: false, message: err.message });
    }
};
// Community Post
export const newCommunityPosts = async (req, res) => {
    try {
        const { location, description, askingPrice, category, name, valid, type } = req.body;
        var imgFilesArray = [];
        const img = req.files;
        const URL =
            (process.env.NODE_ENV === "development") ? "http://localhost:8000/post/" : "http://159.203.67.155:8000/post/";
        img.forEach((element) => {
            var imgUrl = URL + element.filename;
            imgFilesArray.push(imgUrl);
        });
        // var imgUrl =  "http://159.203.67.155:8000/api/photos/"+img  //For server
        const decoded = await jwt.verify(
            req.headers.token,
            configKey.secrets.JWT_SECRET
        );
        const data = await Users.findOne({ emailId: decoded.sub });
        const userId = data._id;
        // const userId =req.body.userId
        var highBid = 0;
        var now = new Date();
        await photosList.create({
            name,
            userId,
            location,
            description,
            askingPrice,
            category,
            highBid,
            valid,
            type,
            imageUrl: imgFilesArray,
        });
        return res.status(201).send({
            success: true,
            message: "Community Post created successfully.",
        });
    } catch (err) {
        res.status(422).send({ success: false, message: err.message });
    }
};

//---------------------------------------------------- add comment

export const Addcomment = async (req, res) => {
    try {

        const postId = req.body.postId;
        const newcomment = req.body.newcomment;

        const Pdata = await photosList.findOne({ _id: postId })
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const userId = data._id

        const userData = await Users.findById({ _id: userId });
        var now = new Date();

        var photoData = await photosList.findByIdAndUpdate({ _id: postId }, {
            $push: { comment: { _id: mongoose.Types.ObjectId(), userId: userId, name: userData.name, profile: userData.profileImgURl, newcomment: newcomment, designation: userData.designation, email: userData.emailId, date: now } }
        })
        fname(Pdata.userId);
        const notNeed = await notificationList.findOne({ userId: Pdata.userId })
        if (userId != Pdata.userId) {
            await notificationList.findOneAndUpdate({ userId: Pdata.userId }, {
                $push: {
                    notification: {
                        type: "comment",
                        userCommentId: userId,
                        userprofile: data.profileImgURl,
                        content: data.name + " make comment: \"" + newcomment + "\" on your post",
                        phostImg: Pdata.imageUrl,
                        date: now
                    }
                }
            })
        } else { console.log("self comment"); }

        return res.status(201).send({
            success: true,
            data: photoData.comment,
            message: 'comment successfully added'
        })
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//------------------------------------------------------- add bid in post

export const newBid = async (req, res) => {
    try {
        const postId = req.body.postId;
        const newBid = req.body.newBid;

        const Pdata = await photosList.findOne({ _id: postId })
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const userId = data._id
        var now = new Date();

        const hbid = await photosList.findOne({ _id: postId })
        var current = hbid.highBid

        async function notis() {
            fname(Pdata.userId);
            const notNeed = await notificationList.findOne({ userId: Pdata.userId })
            await notificationList.findOneAndUpdate({ userId: Pdata.userId }, {
                $push: {
                    notification: {
                        type: "bid",
                        userBidId: userId,
                        userprofile: data.profileImgURl,
                        content: data.name + "has bidded \"$" + newBid + "\" on your post",
                        phostImg: Pdata.imageUrl,
                        date: now
                    }
                }
            })
        }

        if (userId != Pdata.userId) {
            if (current < newBid) {
                await photosList.findByIdAndUpdate({ _id: postId }, {
                    $push: { currentBid: { userId: userId, Bid: newBid, date: now } }
                })
                await photosList.findByIdAndUpdate({ _id: postId }, { highBid: newBid })
                notis();
            }
            else {
                await photosList.findByIdAndUpdate({ _id: postId }, {
                    $push: { currentBid: { userId: userId, Bid: newBid, date: now } }
                })
                notis();
            }
            return res.status(201).send({
                success: true,
                message: 'bid added successfully'
            })

        } else { res.send("you can\'t bid") }

    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//------------------------------------------------------------- like

export const AddLike = async (req, res) => {
    try {
        const postId = req.body.postId;
        const Pdata = await photosList.findOne({ _id: postId })

        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const userId = data._id

        var now = new Date();
        const postData = await photosList.findOne({ _id: postId })

        var temp = 0
        postData.like.forEach(element => {
            if (element.userId == userId.toString()) {
                temp = 1
            }
        });
        if (temp == 1) {
            console.log("already LIKEED");
            await photosList.findByIdAndUpdate({ _id: postId }, {
                $pull: { like: { userId: userId } }
            })
            if (userId != Pdata.userId) {
                await notificationList.findOneAndUpdate({ userId: Pdata.userId }, {
                    $pull: { notification: { userLikedId: userId } }
                })
            }
        }
        if (temp == 0) {
            console.log("like done");
            await photosList.findByIdAndUpdate({ _id: postId }, {
                $push: { like: { userId: userId, name: data.name, date: now } }
            })
            if (userId != Pdata.userId) {
                fname(Pdata.userId);
                const notNeed = await notificationList.findOne({ userId: Pdata.userId })
                await notificationList.findOneAndUpdate({ userId: Pdata.userId }, {
                    $push: {
                        notification: {
                            type: "like",
                            userLikedId: userId,
                            userprofile: data.profileImgURl,
                            content: data.name + " has liked your photo",
                            phostImg: Pdata.imageUrl,
                            status: 0,
                            date: now
                        }
                    }
                })
            } else { console.log("self like") }
        }
        const total = await photosList.findOne({ _id: postId })
        return res.status(201).send({
            success: true,
            data: total.like,
            temp: temp,
            message: 'successfully added'
        })




    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//----------------------------------------------------------share
export const sharing = async (req, res) => {
    try {
        const postId = req.body.postId;
        const sharedUserId = req.body.receiverId;

        const Pdata = await photosList.findOne({ _id: postId })
        const Rdata = await Users.findOne({ _id: sharedUserId })
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const userId = data._id
        var now = new Date();


        const friendData = await FriendList.findOne({ userId: userId })
        if (!friendData) {
            console.log("friend list not found");
        }
        else {
            console.log(friendData.friendList);
        }

        await photosList.findByIdAndUpdate({ _id: postId }, {
            $push: { share: { userId: userId, sharedUser: sharedUserId, date: now } }
        })
        if (userId != Pdata.userId) {
            fname(Pdata.userId);
            const notNeed = await notificationList.findOne({ userId: Pdata.userId })
            await notificationList.findOneAndUpdate({ userId: Pdata.userId }, {
                $push: {
                    notification: {
                        type: "share",
                        usershareId: userId,
                        receiver: Rdata._id,
                        userprofile: data.profileImgURl,
                        // content: data.name + " make share your post with: \"" + Rdata.name + "\"",
                        content: data.name + " share your post with his/her timeline!",
                        phostImg: Pdata.imageUrl,
                        date: now
                    }
                }
            })
        } else { console.log("self share"); }
        fname(Pdata.sharedUserId);
        const notNeeded = await notificationList.findOne({ userId: sharedUserId })
        await notificationList.findOneAndUpdate({ userId: Rdata._id }, {
            $push: {
                notification: {
                    type: "share",
                    usershareId: userId,
                    postId: Pdata._id,
                    userprofile: Pdata.profileImgURl,
                    content: "You shared " + data.name + " post in your timeline.",
                    phostImg: Pdata.imageUrl,
                    date: now
                }
            }
        })
        return res.status(201).send({
            success: true,
            message: 'share successfully'
        })
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

//------------------------------------------------------------------user uploaded photos
export const userUploadedPhotos = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({ emailId: decoded.sub })
        const userId = data._id

        const postData = await photosList.findOne({ userId: userId })
        if (!postData) {
            console.log("post data not found");
        }
        else {
            postData.forEach(element => {
                console.log(element.imageUrl)
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}


//-------------------------------------------------------home page post
export const homePagePost = async (req, res) => {
    try {
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const user = await Users.findOne({ emailId: decoded.sub })
        const userId = user._id;
        // const {userId} = req.body;
        var homePost = [];
        const Friend = await FriendList.findOne({ userId: userId })
        if (Friend == null) {
            res.status(201).send({
                success: true,
                message: "You are not any friend"
            })
        }
        if (!Friend) {
            res.status(201).send({
                success: false,
                message: 'You are not any friend'
            })
        }
        var fList = Friend.friendList;
        for (var i = 0; i < fList.length; i++) {
            var post = await photosList.find({ userId: fList[i].friendId })
            for (var j = 0; j < post.length; j++) {
                var location = await Users.findById({ _id: post[j].userId })
                if (location.length <= 0) {
                    res.status(401).send({
                        success: false,
                        message: "user data not found"
                    })
                }
                post[j].city = location.city
                post[j].state = location.state
                homePost.push(post[j]);
            }
        }
        var date = new Date().getTime()
        var communityPost = await photosList.find({ $or: [{ type: 'community' }, { type: 'promotion' }] })
        for (var c = 0; c < communityPost.length; c++) {
            if (new Date(communityPost[c].valid).getTime() > date) {
                homePost.push(communityPost[c]);
            }
        }
        var userPost = await photosList.find({ userId: userId })

        if (userPost.length != 0) {
            for (var j = 0; j < userPost.length; j++) {
                var location = await Users.findById({ _id: userPost[j].userId })
                if (location.length <= 0) {
                    res.status(401).send({
                        success: false,
                        message: "user data not found"
                    })
                }
                userPost[j].city = location.city
                userPost[j].state = location.state
                homePost.push(userPost[j]);
            }
            var sortedpost = homePost.sort(function (var1, var2) {
                var a = new Date(var1.createdAt), b = new Date(var2.createdAt);
                if (a > b)
                    return -1;
                if (a < b)
                    return 1;
                return 0;
            });
            for (var s = 0; s < sortedpost.length; s++) {
                const temp = []
                for (var h = 0; h < sortedpost[s].imageUrl.length; h++) {
                    const t = { image: "", thumbImage: "", size: "" };
                    if (sortedpost[s].imageUrl.length == 1) {
                        t['size'] = 100
                    }
                    else if (sortedpost[s].imageUrl.length == 2 || sortedpost[s].imageUrl.length >= 4) {
                        t['size'] = 50
                    }
                    else if (sortedpost[s].imageUrl.length == 3) {
                        if (h == 0) {
                            t['size'] = 100
                        }
                        else {
                            t['size'] = 50
                        }
                    }

                    t['image'] = sortedpost[s].imageUrl[h];
                    t['thumbImage'] = sortedpost[s].imageUrl[h];
                    temp.push(t);
                }
                sortedpost[s].imageUrl = temp
            }
            return res.status(201).send({
                success: true,
                message: "successfully.",
                posts: sortedpost
            });
        } else {
            res.status(201).send({
                code: 401,
                success: false,
                message: "You don't have any posts",
            });
        }
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}

// get post data particular month of year
export const getPostMonthdata = async (req, res) => {
    try {
        const allUser = await photosList.aggregate([{
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
                        postCount: allUser.filter(a1 => a1.createdAt.toISOString().startsWith(a)).length,
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
            res.send({ status: true, length: allUser.length, reduced: resa, postData: resa.map(a => a.postCount) })
        }).catch((err) => {
            res.send(err)
        })

    } catch (err) {
        res.send(err)
    }
}

//delete post
export const deletePost = async (req, res) => {
    try {
        var { postId } = req.body
        photosList.findByIdAndDelete({ _id: postId }, (err, response) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: "oops! something wrong",
                });
            } else {
                if (response.imageUrl) {
                    response.imageUrl.forEach(element => {
                        let filePath = path.join(
                            __dirname,
                            "..",
                            "..",
                            "public",
                            "post",
                            element.split("/post/")[1]
                        );
                        fs.unlinkSync(filePath);
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: "successfully.",
                });
            }
        });
    }
    catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        })
    }
}