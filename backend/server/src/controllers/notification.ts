import Chat from "@/db/mongodb/models/Chat";
import Notification from "@/db/mongodb/models/Notification";
import UnseenCount from "@/db/mongodb/models/UnseenCount";
import User from "@/db/mongodb/models/User";
import { clientE } from "@/socket/events";
import { _io, channels, groupOffline, userSocketIDs } from "@/socket/index";
import {
  AddUsersInGroupReqSchema,
  CreateGroupReqSchema,
  OtherMongoUserIdReqSchema,
  SetOrderReqSchema,
  SetUnseenCountReqSchema,
} from "@/types/controllers/notificationReq";
import { CustomRequest } from "@/types/custom";
import Channel from "@/types/channel";
import { SoAddedInGroup, SoRequestAccepted, SoUserRequest } from "@/types/socket/eventTypes";
import emitSocketEvent from "@/socket/emitSocketEvent";
import { errRes } from "@/utils/error";
import { getMultiUsersSockets, getSingleUserSockets } from "@/socket/getSocketIds";
import { Request, Response } from "express";
import { uploadToCloudinary } from "@/utils/cloudinaryHandler";
import Group from "@/db/mongodb/models/Group";
import { deleteFile } from "@/utils/deleteFile";
import { db } from "@/db/postgresql/connection";
import { users } from "@/db/postgresql/schema/users";
import { follows } from "@/db/postgresql/schema/follows";
import { and, eq, ilike, isNull, ne, sql } from "drizzle-orm";
import { requests } from "@/db/postgresql/schema/requests";
import { OtherPostgreSQLUserIdReqSchema } from "@/types/controllers/common";
import { checkGroupMembers } from "@/utils/helpers";
import mongoose from "mongoose";
import { kafkaProducer } from "@/kafka/kafka";

type CustomIUser = {
  _id: string;
  userName: string;
  imageUrl?: string;
  isAlreadyRequested: boolean;
};
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const { userName } = req.query;

    // validation
    if (!userName) {
      return errRes(res, 400, "invalid userName for search");
    }

    const userFriends = await User.findById({ _id: userId }).select({ friends: true }).exec();
    const sentRequests = await Notification.findOne({ userId: userId }).select({ sentFriendRequests: true }).exec();

    const excluedIds: string[] = [];

    userFriends?.friends?.map((item) => {
      excluedIds.push(item.friendId._id.toString());
    });
    excluedIds.push(userId);

    const users = await User.find({ _id: { $nin: excluedIds }, userName: { $regex: `${userName}`, $options: "i" } })
      .select({ userName: true, imageUrl: true })
      .limit(25)
      .exec();

    if (users.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no user found for given username",
      });
    }

    if (!sentRequests) {
      return errRes(res, 400, "no notification exist for current user");
    }

    const newData: CustomIUser[] = [];

    users.forEach((userSuggestion) => {
      const data: CustomIUser = {
        _id: userSuggestion._id.toString(),
        userName: userSuggestion.userName,
        imageUrl: userSuggestion.imageUrl,
        isAlreadyRequested: sentRequests.sentFriendRequests.includes(userSuggestion._id),
      };
      newData.push(data);
    });

    return res.status(200).json({
      success: true,
      message: "users",
      users: newData,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting users", error);
  }
};

export const getFollowUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const { userName } = req.query;

    // validation
    if (!userName) {
      return errRes(res, 400, "invalid userName for search");
    }

    const followUsers = await db
      .selectDistinctOn([users.id], {
        id: users.id,
        userName: users.userName,
        imageUrl: users.imageUrl,
        isFollowed: sql<boolean>`CASE WHEN ${follows.followerId} = ${userId2} THEN true ELSE false END`,
        isRequested: sql<boolean>`CASE WHEN ${requests.fromId} = ${userId2} THEN true ELSE false END`,
      })
      .from(users)
      .leftJoin(follows, and(eq(follows.followingId, users.id), eq(follows.followerId, userId2)))
      .leftJoin(requests, and(eq(requests.toId, users.id), eq(requests.fromId, userId2)))
      .where(and(ilike(users.userName, `%${userName}%`), ne(users.id, userId2)))
      .limit(25)
      .execute();

    if (followUsers.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no follow users for userName",
      });
    }

    return res.status(200).json({
      success: true,
      message: "follow users for userName",
      followUsers: followUsers,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting follow users", error);
  }
};

export const sendRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    const otherUserIdReq = OtherMongoUserIdReqSchema.safeParse(req.body);

    if (!otherUserIdReq.success) {
      return errRes(res, 400, `invalid data for sending request, ${otherUserIdReq.error.message}`);
    }

    const data = otherUserIdReq.data;

    // check user exist or not for req id
    const checkOtherUser = await Notification.findOne({
      userId: data.otherUserId,
      friendRequests: { $nin: [userId] },
    })
      .select({ userId: true, friendRequests: true })
      .populate({
        path: "userId",
        select: "friends",
      })
      .exec();

    if (!checkOtherUser) {
      return errRes(res, 400, "other user does not exist or already have friend request for current user");
    }

    // check if otherUserId already present in current user sentFriendRequests
    const myDetails = await Notification.findOne({ userId: userId, sentFriendRequests: { $nin: [data.otherUserId] } })
      .select({ userId: true, sentFriendRequests: true })
      .populate({
        path: "userId",
        select: "userName imageUrl friends",
      })
      .exec();

    if (!myDetails) {
      return errRes(res, 400, "otherUserId already present in sentFriendRequests of current user");
    }

    // check if current user is already a friend of user(otherUserId) to which request is send
    const checkAlreadyFrineds =
      checkOtherUser.userId.friends.some((item) => userId === item.friendId._id.toString()) ||
      myDetails.userId.friends.some((item) => data.otherUserId === item.friendId._id.toString());

    if (checkAlreadyFrineds) {
      return errRes(res, 400, "requested user is already friend of current user");
    }

    // in other user notification in friendRequests push userId
    checkOtherUser.friendRequests.push(new mongoose.Types.ObjectId(userId));
    // in current user notification in sentFriendRequests push otherUserId
    myDetails.sentFriendRequests.push(new mongoose.Types.ObjectId(data.otherUserId));

    // save updated data
    await Promise.all([checkOtherUser.save(), myDetails.save()]);

    // check if other user is online then emit user request event
    const socketIds = getSingleUserSockets(data.otherUserId);
    if (socketIds.length > 0) {
      const sdata: SoUserRequest = {
        _id: userId,
        userName: myDetails.userId.userName,
        imageUrl: myDetails.userId.imageUrl,
      };
      emitSocketEvent(socketIds, clientE.USER_REQUEST, sdata);
    }

    return res.status(200).json({
      success: true,
      message: "request send successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while sending request", error);
  }
};

export const acceptRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    const otherUserIdReq = OtherMongoUserIdReqSchema.safeParse(req.body);

    if (!otherUserIdReq.success) {
      return errRes(res, 400, `invalid data for accepting request, ${otherUserIdReq.error.message}`);
    }

    const data = otherUserIdReq.data;

    // check other user exist or not for otherUserId
    const otherUser = await Notification.findOne({
      userId: data.otherUserId,
      sentFriendRequests: { $elemMatch: { $eq: userId } },
    })
      .select({ userId: true, unseenMessages: true, friendRequests: true, sentFriendRequests: true })
      .populate({
        path: "userId",
        select: "firstName lastName imageUrl publicKey friends chatBarOrder",
      })
      .exec();

    if (!otherUser) {
      return errRes(
        res,
        400,
        "user not present for given id or current user id is not present in sentFriendRequests of otherUserId"
      );
    }

    // check if current user Notification contains otherUserId
    const myDetails = await Notification.findOne({
      userId: userId,
      friendRequests: { $elemMatch: { $eq: data.otherUserId } },
    })
      .select({ userId: true, unseenMessages: true, friendRequests: true, sentFriendRequests: true })
      .populate({
        path: "userId",
        select: "firstName lastName imageUrl publicKey friends chatBarOrder",
      })
      .exec();

    if (!myDetails) {
      return errRes(res, 400, "otherUserId not present in friendRequests for current user");
    }

    // check if OtherUserId for accepting request is already a friend of current user
    const checkAlreadyFriend =
      otherUser.userId.friends.some((friend) => friend.friendId._id.toString() === userId) ||
      myDetails.userId.friends.some((friend) => friend.friendId._id.toString() === data.otherUserId);

    if (checkAlreadyFriend) {
      return errRes(res, 400, "otherUserId for accepting as friend is already a friend of current user");
    }

    /*
      verfication for making friend is done now create chat and channel 
      create chatId for both users and add both users in each others friends array
    */

    // now remove userId from otherUser sentFriendRequests and otherUserId from myDetails friendRequests
    otherUser.sentFriendRequests = otherUser.sentFriendRequests.filter(
      (sentFriendRequestUserId) => sentFriendRequestUserId.toString() !== userId
    );
    myDetails.friendRequests = myDetails.friendRequests.filter(
      (friendRequestUserId) => friendRequestUserId.toString() !== data.otherUserId
    );

    // for safety if current user also have sent a friend request in past then remove request vice versa for both user
    otherUser.friendRequests = otherUser.friendRequests.filter(
      (friendRequestUserId) => friendRequestUserId.toString() !== userId
    );
    myDetails.sentFriendRequests = myDetails.sentFriendRequests.filter(
      (sentFriendRequestUserId) => sentFriendRequestUserId.toString() !== data.otherUserId
    );

    // user 1 is who initially sent request and user 2 is who accepted that request
    const chat = await Chat.create({ user1: data.otherUserId, user2: userId });

    // create unseen count for both users , set 0 for both users in their unseenMessages for chat._id as mainId
    const ucotherUser = await UnseenCount.create({ userId: data.otherUserId, mainId: chat._id });
    const ucUser = await UnseenCount.create({ userId: userId, mainId: chat._id });

    // set unseen messages count id
    otherUser.unseenMessages.push(ucotherUser._id);
    myDetails.unseenMessages.push(ucUser._id);

    // update friends for both users
    otherUser.userId.friends.push({ friendId: new mongoose.Types.ObjectId(userId), chatId: chat._id });
    myDetails.userId.friends.push({ friendId: new mongoose.Types.ObjectId(data.otherUserId), chatId: chat._id });

    otherUser.userId.chatBarOrder.unshift(chat._id.toString());
    myDetails.userId.chatBarOrder.unshift(chat._id.toString());

    // create a new channel instance
    const newChannel = new Channel();
    // set channel for new chatid
    channels.set(chat._id.toString(), newChannel);

    /* 
      save all updated data
    */
    await Promise.all([otherUser.save(), otherUser.userId.save(), myDetails.save(), myDetails.userId.save()]);

    const socketIds = getSingleUserSockets(data.otherUserId);

    // send notification for request accepted if otherUser is online
    if (socketIds.length > 0) {
      const sdata: SoRequestAccepted = {
        _id: myDetails.userId._id.toString(),
        chatId: chat._id.toString(),
        firstName: myDetails.userId.firstName,
        lastName: myDetails.userId.lastName,
        imageUrl: myDetails.userId.imageUrl,
        publicKey: myDetails.userId.publicKey,
      };
      emitSocketEvent(socketIds, clientE.REQUEST_ACCEPTED, sdata);
      emitSocketEvent(socketIds, clientE.SET_USER_ONLINE, myDetails.userId._id.toString());

      // socketId is of other user, now send useronline to myself as other user is online and socketId is present
      // get mysocketId
      const mySocketIds = getSingleUserSockets(userId);
      if (mySocketIds.length > 0) {
        emitSocketEvent(mySocketIds, clientE.SET_USER_ONLINE, otherUser.userId._id.toString());
      }
    }

    return res.status(200).json({
      success: true,
      message: "request accepted successfully",
      newFriend: {
        _id: otherUser.userId._id,
        firstName: otherUser.userId.firstName,
        lastName: otherUser.userId.lastName,
        imageUrl: otherUser.userId.imageUrl,
      },
      newChatId: chat._id,
      newFriendPublicKey: otherUser.userId.publicKey,
    });
  } catch (error) {
    return errRes(res, 500, "error while accept request", error);
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).userId;
    const otherUserIdReq = OtherMongoUserIdReqSchema.safeParse(req.body);

    if (!otherUserIdReq.success) {
      return errRes(res, 400, `invalid data for deleting request, ${otherUserIdReq.error.message}`);
    }

    const data = otherUserIdReq.data;

    const checkOther = await Notification.findOne({
      userId: data.otherUserId,
      sentFriendRequests: { $elemMatch: { $eq: userId } },
    })
      .select({ sentFriendRequests: true })
      .exec();
    if (!checkOther) {
      return errRes(res, 400, "other user does not exist or no sent request exist in other user notification");
    }

    const myDetails = await Notification.findOne({
      userId: userId,
      friendRequests: { $elemMatch: { $eq: data.otherUserId } },
    })
      .select({ friendRequests: true })
      .exec();
    if (!myDetails) {
      return errRes(res, 400, "otherUserId does not exist in friendRequests of current user");
    }

    // now update data
    checkOther.sentFriendRequests = checkOther.sentFriendRequests.filter(
      (sentFriendRequestsUserId) => sentFriendRequestsUserId._id.toString() !== userId
    );
    myDetails.friendRequests = myDetails.friendRequests.filter(
      (friendRequestUserId) => friendRequestUserId._id.toString() !== data.otherUserId
    );

    // save updated data
    await Promise.all([checkOther.save(), myDetails.save()]);

    return res.status(200).json({
      success: true,
      message: "req deleted successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while deleting request", error);
  }
};

export const getAllNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const notifications = await Notification.findOne({ userId: userId })
      .select({ friendRequest: true, unseenMessages: true })
      .populate([
        {
          path: "friendRequests",
          select: "userName imageUrl",
        },
        {
          path: "unseenMessages",
          select: "mainId count -_id",
        },
      ])
      .exec();

    if (notifications?.friendRequests.length === 0 && notifications.unseenMessages.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no notifications for user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "notifications for user",
      userReqs: notifications?.friendRequests,
      unseenMessages: notifications?.unseenMessages,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting notifications", error);
  }
};

export const createGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    // validation

    const createGroupReq = CreateGroupReqSchema.safeParse(req.body);

    if (!createGroupReq.success) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, `invalid data for creating group, ${createGroupReq.error.message}`);
    }

    const data = createGroupReq.data;

    // check groupMembers for creating group
    const members = checkGroupMembers(data.userIdsInGroup);
    if (members.length === 0) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "invalid groupIds for creating group");
    }
    // push current userId also in members array
    members.push(userId);

    let secUrl;
    if (req.file) {
      secUrl = await uploadToCloudinary(req.file);
      if (secUrl === null) {
        return errRes(res, 500, "error while uploading group image");
      }
    } else {
      secUrl = "";
    }

    const newGroup = await Group.create({
      groupName: data.groupName,
      gpCreater: userId,
      gpImageUrl: secUrl,
      members: members,
    });

    await Promise.all(
      members.map(async (userId) => {
        const ucOfGroupMem = await UnseenCount.create({ userId: userId, mainId: newGroup._id });
        await Notification.findOneAndUpdate({ userId: userId }, { $push: { unseenMessages: ucOfGroupMem._id } }).exec();
        const groupUser = await User.findById({ _id: userId });
        groupUser?.chatBarOrder.unshift(newGroup._id.toString());
        await groupUser?.save();
      })
    );

    // Create a new mutex instance
    const newChannel = new Channel();
    // set newmutex for new groupId
    channels.set(newGroup._id.toString(), newChannel);

    const membersSockerIds = getMultiUsersSockets(members, userId);
    const mySocketIds = getSingleUserSockets(userId);

    // set offline member for group
    groupOffline.set(newGroup._id.toString(), new Set(membersSockerIds.offline));

    // join groupId room with all online members
    if (mySocketIds.length > 0) {
      _io.in(mySocketIds).socketsJoin(newGroup._id.toString());
    }

    if (membersSockerIds.online.length > 0) {
      _io.in(membersSockerIds.online).socketsJoin(newGroup._id.toString());

      // in online users of group, event is emitted only except for creater, as creater get group in response
      const sdata: SoAddedInGroup = {
        _id: newGroup._id.toString(),
        isAdmin: false,
        groupName: data.groupName,
        gpImageUrl: secUrl,
      };
      emitSocketEvent(membersSockerIds.online, clientE.ADDED_IN_GROUP, sdata);
    }

    return res.status(200).json({
      success: true,
      message: "group created successfully",
      newGroup: {
        _id: newGroup._id,
        isAdmin: true,
        groupName: newGroup.groupName,
        gpImageUrl: newGroup.gpImageUrl,
      },
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while creating group", error);
  }
};

export const addUsersInGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    // validation

    const addUsersInGroupReq = AddUsersInGroupReqSchema.safeParse(req.body);

    if (!addUsersInGroupReq.success) {
      return errRes(res, 400, `invalid data for adding users in group, ${addUsersInGroupReq.error.message}`);
    }

    const data = addUsersInGroupReq.data;

    const updateGroup = await Group.findOne({ _id: data.groupId, gpCreater: userId });

    if (!updateGroup) {
      return errRes(res, 400, "no group found with given group Id");
    }

    if (updateGroup.members.length + data.userIdsToBeAdded.length > 50) {
      return errRes(res, 400, "max limit for user in group is 50");
    }

    // check if any new user is already present in group members
    const containsNewMember = updateGroup.members.some((oldMemberId) =>
      data.userIdsToBeAdded.includes(oldMemberId.toString())
    );

    if (containsNewMember) {
      return errRes(res, 400, "new member is already present in group memebers");
    }

    const updateUsersOffline = groupOffline.get(updateGroup._id.toString());
    if (!updateUsersOffline) {
      return errRes(res, 500, "group not present in groupIds or groupOffline");
    }

    // create unseen count for each new group memeber and update notification of each user
    await Promise.all(
      data.userIdsToBeAdded.map(async (userId) => {
        const ucOfGroupMem = await UnseenCount.create({ userId: userId, mainId: data.groupId });
        await Notification.findOneAndUpdate({ userId: userId }, { $push: { unseenMessages: ucOfGroupMem._id } }).exec();
        await User.findByIdAndUpdate(
          { _id: userId },
          { $push: { chatBarOrder: { $each: [data.groupId], $position: 0 } } }
        );
      })
    );

    data.userIdsToBeAdded.forEach((newMemberUserId) =>
      updateGroup.members.push(new mongoose.Types.ObjectId(newMemberUserId))
    );

    // save updated group
    await updateGroup.save();

    // now send notification to online users and add offline user in groupOffline
    const newMembersSocketIds = getMultiUsersSockets(data.userIdsToBeAdded);
    const sData: SoAddedInGroup = {
      _id: updateGroup._id.toString(),
      isAdmin: false,
      groupName: updateGroup.groupName,
      gpImageUrl: updateGroup.gpImageUrl,
    };

    if (newMembersSocketIds.offline.length > 0) {
      const offlineUsers = Array.from(updateUsersOffline).concat(newMembersSocketIds.offline);
      groupOffline.set(data.groupId, new Set(offlineUsers));
    }

    if (newMembersSocketIds.online.length > 0) {
      _io.in(newMembersSocketIds.online).socketsJoin(updateGroup._id.toString());
      emitSocketEvent(newMembersSocketIds.online, clientE.ADDED_IN_GROUP, sData);
    }

    return res.status(200).json({
      success: true,
      message: "new users added to group",
    });
  } catch (error) {
    return errRes(res, 500, "error while adding users in group", error);
  }
};

export const checkOnlineFriends = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();

    if (userData?.friends.length === undefined || userData?.friends.length === 0) {
      return res.status(200).json({
        success: false,
        message: "user have no friends",
      });
    }

    const onlineFriends: string[] = [];

    userData?.friends.forEach((friend) => {
      const friendId = friend.friendId._id.toString();
      if (userSocketIDs.has(friendId)) {
        onlineFriends.push(friendId);
      }
    });

    if (onlineFriends.length < 1) {
      return res.status(200).json({
        success: false,
        message: "no online friends",
      });
    }

    return res.status(200).json({
      success: true,
      message: "online friends",
      onlineFriends: onlineFriends,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting online friends", error);
  }
};

export const setUnseenCount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const setUnseenCountReq = SetUnseenCountReqSchema.safeParse(req.body);

    if (!setUnseenCountReq.success) {
      return errRes(res, 400, `invalid data for setting unseen count, ${setUnseenCountReq.error.message}`);
    }
    const data = setUnseenCountReq.data;

    await kafkaProducer.unseenCount([userId], data.mainId, data.count);

    return res.status(200).json({
      success: true,
      message: "unseen count updated successfully",
    });
  } catch (error) {
    return errRes(res, 400, "error while setting unseen count", error);
  }
};

export const setOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const setOrderReq = SetOrderReqSchema.safeParse(req.body);
    if (!setOrderReq.success) {
      return errRes(res, 400, `invalid data for setunseencount, ${setOrderReq.error.message}`);
    }

    const data = setOrderReq.data;

    const user = await User.findById({ _id: userId }).select({ chatBarOrder: true });
    const existingIndex = user?.chatBarOrder.indexOf(data.mainId);

    if (existingIndex !== undefined && existingIndex !== -1) {
      // mainId exists, move it to the first position
      user?.chatBarOrder.splice(existingIndex, 1); // Remove from current position
      user?.chatBarOrder.unshift(data.mainId); // Add to the beginning
    } else {
      // mainId doesn't exist
      return errRes(res, 400, "error while getting previous order of mainId");
    }

    // Save the updated document
    await user?.save();

    return res.status(200).json({
      success: true,
      message: "order updated successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while setting order", error);
  }
};

export const sendFollowRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;
    const sendFollowRequestReq = OtherPostgreSQLUserIdReqSchema.safeParse(req.body);

    if (!sendFollowRequestReq.success) {
      return errRes(res, 400, `invalid otherUserId for follow req, ${sendFollowRequestReq.error.message}`);
    }

    const data = sendFollowRequestReq.data;

    if (userId2 === data.otherUserId) {
      return errRes(res, 400, "userId is same as otherUserId for sending request");
    }

    // check if otherUserId is already followed by user
    const checkAlreadyFollowed = await db
      .select({ id: follows.id })
      .from(follows)
      .where(and(eq(follows.followerId, userId2), eq(follows.followingId, data.otherUserId)))
      .limit(1)
      .execute();

    if (checkAlreadyFollowed.length) {
      return errRes(res, 400, "user already followed other user");
    }

    const insertNewRequest = await db
      .insert(requests)
      .values({ fromId: userId2, toId: data.otherUserId })
      .onConflictDoNothing({ target: [requests.fromId, requests.toId] })
      .returning()
      .execute();

    if (insertNewRequest.length === 0) {
      return errRes(res, 400, "follow request already present");
    }

    return res.status(200).json({
      success: true,
      message: "requeset submitted successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while sending follow request", error);
  }
};

export const deleteFollowRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;
    const deleteFollowRequestReq = OtherPostgreSQLUserIdReqSchema.safeParse(req.body);

    if (!deleteFollowRequestReq.success) {
      return errRes(res, 400, `invalid data for deleting follow request, ${deleteFollowRequestReq.error.message}`);
    }

    const data = deleteFollowRequestReq.data;

    const checkDelete = await db
      .delete(requests)
      .where(and(eq(requests.fromId, data.otherUserId), eq(requests.toId, userId2)))
      .returning({ id: requests.id });

    if (checkDelete.length !== 1) {
      return errRes(res, 400, "invalid otherUserId, no request present for deleting follow request");
    }

    return res.status(200).json({
      success: true,
      message: "follow request deleted successfully",
    });
  } catch (error) {
    return errRes(res, 500, "error while deleting follow request", error);
  }
};

export const acceptFollowRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;
    const acceptFollowRequestReq = OtherPostgreSQLUserIdReqSchema.safeParse(req.body);

    if (!acceptFollowRequestReq.success) {
      return errRes(res, 400, `invalid data for accepting follow request, ${acceptFollowRequestReq.error.message}`);
    }

    const data = acceptFollowRequestReq.data;

    if (userId2 === data.otherUserId) {
      return errRes(res, 400, "userId is same as otherUserId for accepting follow request");
    }

    const deleteRequest = await db
      .delete(requests)
      .where(and(eq(requests.fromId, data.otherUserId), eq(requests.toId, userId2)))
      .returning({ id: requests.id })
      .execute();

    if (deleteRequest.length !== 1) {
      return errRes(res, 400, "otherUserId for accepting follow request not present in request");
    }

    const followRes = await db
      .insert(follows)
      .values({ followerId: data.otherUserId, followingId: userId2 })
      .onConflictDoNothing({ target: [follows.followerId, follows.followingId] })
      .returning({ id: follows.id })
      .execute();

    // check query response
    if (followRes.length === 0) {
      return errRes(res, 400, "user already followed other user");
    }

    // user is followed by other user, now increase the count of followers for curr user
    await db
      .update(users)
      .set({ followersCount: sql`${users.followersCount} + 1` })
      .where(eq(users.id, userId2));

    // now increase count of following for other user
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} + 1` })
      .where(eq(users.id, data.otherUserId));

    return res.status(200).json({
      success: true,
      messasge: "user followed other user",
    });
  } catch (error) {
    return errRes(res, 500, "error while following user", error);
  }
};

export const followRequests = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const followRequests = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        userName: users.userName,
        imageUrl: users.imageUrl,
      })
      .from(requests)
      .innerJoin(users, eq(requests.fromId, users.id))
      .where(eq(requests.toId, userId2))
      .execute();

    if (followRequests.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no follow requests for user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "follow requests for user",
      followRequests: followRequests,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting follow request for user", error);
  }
};

export const followSuggestions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const suggestions = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        userName: users.userName,
        imageUrl: users.imageUrl,
      })
      .from(users)
      .leftJoin(follows, and(eq(follows.followingId, users.id), eq(follows.followerId, userId2)))
      .leftJoin(requests, and(eq(users.id, requests.toId), eq(requests.fromId, userId2)))
      .where(and(isNull(requests.toId), isNull(follows.followerId), ne(users.id, userId2)))
      .limit(5)
      .execute();

    if (suggestions.length) {
      return res.status(200).json({
        success: true,
        message: "follow suggestions for user",
        suggestions: suggestions,
      });
    }

    return res.status(200).json({
      success: false,
      message: "no follow suggestions for user",
    });
  } catch (error) {
    return errRes(res, 500, "error while getting follow suggestions", error);
  }
};
