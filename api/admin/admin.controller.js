import { Users } from '../users/user.modal'
import { photosList } from '../photos/photos.modal'
const path = require("path")

// get all Users Info
export const getUsersList = async (req, res) => {
    try {
        const data = await Users.find({});
        // if (!data) {
        //     console.log("users not found");
        // }
        res.status(201).send({
            success: true,
            message: 'Users List fetch successfully',
            data: data,
            length: data.length
        })
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}

export const getPostsList = async (req, res) => {
    try {
        let data = await photosList.find({});
        // if (!data) {
        //     console.log("Posts not found");
        // }        
            res.status(201).send({
                success: true,
                message: 'Post List fetch successfully',
                data: data,
                length: data.length
            })
        
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}
export const getCommunityPost = async (req, res) => {
    try {
        let data = await photosList.find({ $or: [{ type: 'community' }, { type: 'promotion' }] });
        var main_data = []
        for(var c = 0; c < data.length; c++){
            main_data.push({id:data[c]._id, type: data[c].type, description: data[c].description, valid: new Date(data[c].valid).toDateString(), imageLength: data[c].imageUrl.length, commentLength: data[c].comment.length, shareLength: data[c].share.length, likeLength: data[c].like.length})
        }
        // if (!data) {
        //     console.log("Posts not found");
        // }        
            res.status(201).send({
                success: true,
                message: 'Post List fetch successfully',
                main_data: main_data,
                length: data.length
            })
        
    } catch (err) {
        res.status(401).send({
            success: false,
            message: err.message
        });
    }
}

// delete community post
export const deletePost = async (req, res) => {
    try {
        var { postId } = req.body
        photosList.findByIdAndDelete({ _id: postId }, (err, response) => {
            if (err) {
                return res.status(200).send({
                    success: false,
                    message: "oops! something went wrong",
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
                    message: "Post Deleted Successfully.",
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