import { FriendList } from './friend.modal'
import { Users } from '../users/user.modal'
import jwt from 'jsonwebtoken';
import configKey from '../../config'

//push and query
const pullQuery = async (matchId, branchMatchId, branchName) => {
  await FriendList.updateOne({ userId: matchId },
    {
      $pull: {
        [branchName]: {
          friendId: branchMatchId
        }
      }
    });
}
const pushQuery = async (matchId, branchMatchId, branchName) => {
  await FriendList.updateOne({ userId: matchId },
    {
      $push: {
        [branchName]: {
          $each: [{
            friendId: branchMatchId,
            date: new Date()
          }]
        }
      }
    });
}

//featch all user data
export const allUser = async (req, res) => {
  try {
    const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
    const user = await Users.findOne({ emailId: decoded.sub })
    const userId = user._id
    // const {userId} = req.body
    // const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
    const data = await Users.find({ _id: { $not: { $eq: userId } } }, { '_id': 1, 'name': 1, 'profileImgURl': 1 });
    // if (!data) {
    //   console.log("data not found");
    // }
    res.status(201).send({
      success: true,
      message: 'List fetched successfully',
      AllUser: [data]
    })
  }
  catch (err) {
    res.status(401).send({
      success: false, message: err.message
    });
  }
}

//get friend list
export const getFriendList = async (req, res) => {
  try {
    // const {userId} = req.body
    const userId = req.query.userId

    //fetch the data of friendList
    // var array = [];
    const data = await FriendList.findOne({ userId: userId });
    //check data fetched successfull or not
    // if (!data || data == null) {
    //   res.status(201).send({
    //     success: false,
    //     message: 'No friends to show'
    //   })
    // }

    // var array = [];
    // var list = data.friendList;
    // for (var i = 0; i < list.length; i++) {
    //   const userData = await Users.findOne(
    //     { _id: list[i].friendId },
    //     { _id: 1, name: 1, profileImgURl: 1, content: 1, updatedAt: 1, chatStatus: 1 }
    //   );
    //   array.push(userData);
    // }
    // if (array.length > 0) {
    //   //send fetched data list
    //   res.status(201).send({
    //     success: true,
    //     message: 'List fetched successfully',
    //     userInfo: array
    //   })
    // } else {
    //   res.status(201).send({
    //     success: false,
    //     message: 'No friends to show',
    //   })
    // }

    if(data !== null){
      var array = [];
      var list = data.friendList;
      for (var i = 0; i < list.length; i++) {
        const userData = await Users.findOne(
          { _id: list[i].friendId },
          { _id: 1, name: 1, profileImgURl: 1, content: 1, updatedAt: 1, chatStatus: 1 }
        );
        array.push(userData);
      }
      if (array.length > 0) {
        //send fetched data list
        res.status(201).send({
          success: true,
          message: 'List fetched successfully',
          userInfo: array
        })
      } else {
        res.status(201).send({
          success: false,
          message: 'No friends to show',
        })
      }
    } else {
      res.status(201).send({
        success: false,
        message: 'No friends to show',
      })
    }

  }
  catch (err) {
    res.status(401).send({
      success: false, message: err.message
    });
  }
}

//when user send friend request

export const sentFriendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const userFind = await FriendList.find({ userId: userId });

    const requestUserFind = await FriendList.find({ userId: requestId })
    //check user  and requestUser document, available or not! , if not then genrate it
    if (userFind <= 0) {
      await FriendList.create({
        userId: userId,
        friendList: [],
        getRequest: [],
        sentRequest: []
      })
    }
    if (requestUserFind <= 0) {
      await FriendList.create({
        userId: requestId,
        friendList: [],
        getRequest: [],
        sentRequest: []
      })
    }
    //find request inside datbase if found than send response false
    var findRequest = false;
    if (!userFind.length <= 0) {
      await userFind[0].getRequest.map((item) => {
        if (item.friendId == requestId) {
          findRequest = true;
        }
      })
      await userFind[0].sentRequest.map((item) => {
        if (item.friendId == requestId) {
          findRequest = true;
        }
      })
      await userFind[0].friendList.map((item) => {
        if (item.friendId == requestId) {
          findRequest = true;
        }
      })
    }
    if (findRequest) {
      return res.status(401).send({
        success: false,
        message: "friend request already sent or recive either you are already friends"
      })
    }
    //set request in database and send positive response
    //pushQuery(matchId,BranchMatchId,BranchName);
    pushQuery(userId, requestId, "sentRequest");
    pushQuery(requestId, userId, "getRequest");
    res.status(201).send({
      success: true,
      message: 'request sent successfully'
    })
  }
  catch (err) {
    res.status(401).send({
      success: false,
      message: err.message
    })
  }
}

//when approve friend request

export const friendRequestAccept = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const userFind = await FriendList.find({ userId: userId }) //check the user exist or not
    const requestedUser = await Users.findById({ _id: requestId });
    //find request exist or not if not then send negative response
    var requestExist = false;
    userFind[0].getRequest.map((item) => {
      if (item.friendId == requestId) {
        requestExist = true;
      }
    })
    if (!requestExist) {
      return res.status(401).send({
        success: false,
        message: "Request are not exist"
      })
    }
    pushQuery(userId, requestId, "friendList");
    pullQuery(userId, requestId, "getRequest");
    pushQuery(requestId, userId, "friendList");
    pullQuery(requestId, userId, "sentRequest");
    return res.status(200).send({
      success: true,
      message: 'you and ' + [requestedUser.userName] + " are friend's now"
    })

  }
  catch (err) {
    res.status(401).send({
      success: true, message: err.message
    });
  }
}

//when user want friend request List
export const showFriendRequetList = async (req, res) => {
  try {
    const userId = req.query.id
    const userFind = await FriendList.findOne({ userId: userId });
    //check user is exist yes then fetch data else send nagative response
    if (!userFind) {
      await FriendList.create({
        userId: userId,
        friendList: [],
        getRequest: [],
        sentRequest: []
      })
    }
    // res.status(200).send({
    //     success:true,
    //     message:'List found',
    //     list:userFind.getRequest.reverse()
    // })
    if (userFind.getRequest.length <= 0) {
      res.status(200).send({
        success: false,
        message: 'Not any friend request avilable'
      })
    } else {
      res.status(200).send({
        success: true,
        message: 'List found',
        list: userFind.getRequest.reverse()
      })
    }

    // else if (userFind.friendList.length > 0) {
    //   res.status(200).send({
    //       success:true,
    //       message:'List found',
    //       list:userFind.getRequest.reverse()
    //   })
    // }else{
    //   res.status(404).send({
    //       success:true,
    //       message:'Record not found'
    //   })
    // }
    // res.status(200).send({success:true,
    //     message:'List found',
    //     list:userFind.getRequest.reverse()})
    // }
  }
  catch (err) {
    res.status(401).send({
      success: false,
      message: err.message
    })
  }
}
//when user reject friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    pullQuery(userId, requestId, "getRequest"); //remove request from user account
    pullQuery(requestId, userId, "sentRequest");//remove request from requested account
    return res.status(201).send({
      success: true,
      message: 'reject successfully'
    })
  }
  catch (err) {
    res.status(401).send({
      success: false,
      message: err.message
    })
  }
}


// delete sendrequest
export const removeSendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    pullQuery(userId, requestId, "sentRequest");
    pullQuery(requestId, userId, "getRequest");
    return res.status(201).send({
      success: true,
      message: "remove request",
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err.message,
    });
  }
};

//Unfriend friends
export const unFriend = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    pullQuery(userId, requestId, "friendList"); //User Id 
    pullQuery(requestId, userId, "friendList"); //User Friend Id
    return res.status(201).send({
      success: true,
      message: "unfriend successfully",
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err.message,
    });
  }
};

//suggested friends
// const getSuggestFriend = (friend) =>{

// }
export const suggestedFriend = async (req, res) => {
  try {
    const { userId } = req.body;
    const friends = await FriendList.findOne({ userId: userId });
    if (friends) {
      const Fdata = [];
      for (var i = 0; i < friends.friendList.length; i++) {
        Fdata.push(friends.friendList[i].friendId);
      }
      const suggest = [];
      await Promise.all(
        friends.friendList.map(async (item) => {
          const findFriendOfFriend = await FriendList.findOne({
            userId: item.friendId,
          });
          await Promise.all(
            findFriendOfFriend.friendList.map((items) => {
              if (items.friendId != userId) {
                suggest.push(items.friendId);
              }
            })
          );
        })
      );
      var data = suggest.filter(function (i) {
        return this.indexOf(i) < 0;
      }, Fdata);
      const Udata = await Users.find(
        { _id: { $in: data } },
        { _id: 1, name: 1, profileImgURl: 1 }
      );
      return res.status(200).send({
        success: true,
        data: Udata,
      });
    } else {
      res.status(201).send({
        success: false,
        message: "friendlist not found",
      });
    }
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err.message,
    });
  }
};


//show all sentReuest
export const AllSentRequest = async (req, res) => {
  try {
    const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
    const data = await Users.findOne({ emailId: decoded.sub })
    const userId = data._id
    const userFind = await FriendList.findOne({ userId: userId });

    if (!userFind) {
      await FriendList.create({
        userId: userId,
        friendList: [],
        getRequest: [],
        sentRequest: []
      })
    }
    res.status(200).send({
      success: true,
      message: 'List found',
      list: userFind?.sentRequest
    })
  }
  catch (err) {
    res.status(401).send({
      success: true,
      message: err.message
    })
  }
}



// export const showRequestedFriEndData = async(req,res) =>{
//     try{
//         const userId = req.query.id
//         console.log(userId);
//         const userFind = await Users.findOne({_id:userId},{profileImgURl:1, name:1});
//         console.log(userFind);
//         res.status(200).send({success:true,
//             message:'List found',
//             list:userFind})
//         }
//     catch(err){
//         res.status(401).send({
//             success:true,
//             message:err.message
//         })
//     }
// }


//data of requested user data
export const showRequestedFriEndData = async (req, res) => {
  try {
    const userId = req.query.id
    var dataR = [];
    const Friend = await FriendList.findOne({ userId: userId })
    if(Friend !== null){
      var fList = Friend.getRequest;
      for (var i = 0; i < fList.length; i++) {
        var d = await Users.findById({ _id: fList[i].friendId }, { name: 1, profileImgURl: 1 })
        dataR.push(d)
      }
      res.status(200).send({
        success: true,
        message: 'List found',
        list: dataR
      })
    } else {
      res.status(201).send({
        success: false,
        message: 'Data not found'
      })
    }
  }
  catch (err) {
    res.status(401).send({
      success: true,
      message: err.message
    })
  }
}

//-------------------------------------------------------Show all friends for send request but not show your friend
export const allFriendsList = async (req, res) => {
  try {
    const decoded = await jwt.verify(
      req.headers.token,
      configKey.secrets.JWT_SECRET
    );
    const user = await Users.findOne({ emailId: decoded.sub });
    const userId = user._id;
    var array = [userId];
    const friendData = await FriendList.findOne({ userId: userId });
    if(friendData !== null){
      var fList = friendData.friendList;
      for (var i = 0; i < fList.length; i++) {
        array.push(fList[i].friendId);
      }
      const data = await Users.find(
        { _id: { $nin: array } },
        { _id: 1, name: 1, profileImgURl: 1 }
      );
      res.status(200).send({
        success: true,
        message: "List fetched successfully",
        AllUser: [data],
      });
    } else {
      res.status(201).send({
        success: false,
        message: "Data is not available",
      });
    }
  } catch (err) {
    console.log("err", err)
    res.status(401).send({
      success: false,
      message: err.message,
    });
  }
};


//search engin
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
export const searchEngine = async (req, res) => {
  try {
    const { search } = req.query;
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(search), "gi");
      // Get all campgrounds from DB
      const data = await Users.find(
        { $or: [{ name: regex }, { userName: regex }] },
        { id: 1, name: 1, userName: 1, profileImgURl: 1 },

      ).limit(20);
      if (data.length) {
        res.status(201).send({
          success: true,
          data: data,
        });
      } else {
        res.status(201).send({
          code: 400,
          success: false,
          data: "We didn't find any results"
        });
      }
    }
  } catch (err) {
    res.status(401).send({
      success: false,
      data: err.message
    });
  }
};
