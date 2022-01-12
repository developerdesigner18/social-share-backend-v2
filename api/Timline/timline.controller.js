import {timelineList} from './timline.modal'
const pushQuery = async(matchId,branchMatchId,branchName) => {
    await FriendList.updateOne({userId:matchId},
        {
            $push:{
                [branchName]:{
                    $each:[{
                        topic:topic,
                        content:content,
                        writeBy:branchMatchId,
                        date:new Date()
                    }]
                }
            }
        });
}

export const getTimeline = async(req,res) => {
    try{
        const {token} = req.headers
    }
    catch(err){
        res.status(401).send({
            success:true,
            message:err.message
        })
    }
}

export const setTimeline = async(req,res) => {
    try{
        const {} = req.body
        const userFind = await timelineList.findOne({userId:userId})
        if(!userFind){
            await timelineList.create({
                userId:userId,
                timeline:[]
            })
        }
        return res.status({
            success:true,
            message:"data set succssfully"
        })
    }
    catch(err){
        res.status(401).send({
            success:true,
            message:err.message
        })
    }
}