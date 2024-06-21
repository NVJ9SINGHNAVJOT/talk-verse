import Chat from "@/db/mongodb/models/Chat";
import Notification from "@/db/mongodb/models/Notification";
import UnseenCount from "@/db/mongodb/models/UnseenCount";
import User from "@/db/mongodb/models/User";
import { clientE } from "@/socket/events";
import { channels, groupIds, groupOffline, userSocketIDs } from "@/socket/index";
import {
  CreateGroupReqSchema,
  OtherMongoUserIdReqSchema,
  SetOrderReqSchema,
  SetUnseenCountReqSchema,
} from "@/types/controllers/notificationReq";
import { CustomRequest } from "@/types/custom";
import Channel from "@/types/channel";
import { SoAddedInGroup, SoRequestAccepted, SoUserRequest } from "@/types/socket/eventTypes";
import emitSocketEvent from "@/utils/emitSocketEvent";
import { errRes } from "@/utils/error";
import { getMultiSockets, getSingleSocket } from "@/utils/getSocketIds";
import { Request, Response } from "express";
import { uploadToCloudinary } from "@/utils/cloudinaryHandler";
import Group from "@/db/mongodb/models/Group";
import { deleteFile } from "@/utils/deleteFile";
import { isValidMongooseObjectId } from "@/validators/mongooseId";
import { db } from "@/db/postgresql/connection";
import { user } from "@/db/postgresql/schema/user";
import { follow } from "@/db/postgresql/schema/follow";
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { request } from "@/db/postgresql/schema/request";
import { OtherPostgreSQLUserIdReqSchema } from "@/types/controllers/common";
import { checkGroupMembers } from "@/utils/helpers";

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const { userName } = req.query;

    // validation
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "invalid username input",
      });
    }

    const userFriends = await User.findById({ _id: userId }).select({ friends: true }).exec();

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

    return res.status(200).json({
      success: true,
      message: "users",
      users: users,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting users");
  }
};

export const sendRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    const otherUserIdReq = OtherMongoUserIdReqSchema.safeParse(req.body);

    if (!otherUserIdReq.success) {
      return errRes(res, 400, `invalid data for sending request, ${otherUserIdReq.error.toString()}`);
    }

    const data = otherUserIdReq.data;

    // check user exist or not for req id
    const checkUser = await User.findById({ _id: data.otherUserId })
      .select({ userName: true, imageUrl: true, friends: true })
      .exec();

    if (!checkUser) {
      return errRes(res, 400, "user not present for given reqUserId");
    }

    // check if current user is already a friend of user(otherUserId) to which request is send
    if (checkUser.friends.length > 0) {
      let errCheck: boolean = false;
      checkUser.friends.forEach((item) => {
        if (userId === item.friendId._id.toString()) {
          errCheck = true;
          return;
        }
      });
      if (errCheck) {
        return errRes(res, 400, "requested user is already friend of current user");
      }
    }

    // check if a request already exist of current user in otherUserId notification
    const checkNotification = await Notification.findById(
      { _id: data.otherUserId },
      { friendRequests: { $in: data.otherUserId } }
    );
    if (checkNotification) {
      return errRes(res, 400, "friend request already exits in otherUserId notification");
    }

    const myDetails = await User.findById({ _id: userId })
      .select({ userName: true, imageUrl: true, _id: false })
      .exec();
    if (!myDetails) {
      return errRes(res, 400, "could not found user details");
    }

    // update user with req
    await Notification.updateOne({ userId: data.otherUserId }, { $push: { friendRequests: userId } }).exec();

    const socketIds = getSingleSocket(data.otherUserId);
    if (socketIds) {
      const sdata: SoUserRequest = {
        _id: userId,
        userName: myDetails.userName,
        imageUrl: myDetails.imageUrl,
      };
      emitSocketEvent(req, socketIds, clientE.USER_REQUEST, sdata);
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
      return errRes(res, 400, `invalid data for accepting request, ${otherUserIdReq.error.toString()}`);
    }

    const data = otherUserIdReq.data;

    const otherUser = await User.findById({ _id: data.otherUserId })
      .select({ firstName: true, lastName: true, imageUrl: true, publicKey: true, friends: true })
      .exec();

    // check user exist or not for req id
    if (!otherUser) {
      return errRes(res, 400, "user not present for given id");
    }

    // check if userId for accepting request is already a friend of current user
    const checkAlreadyFriend = otherUser.friends.some((friend) => friend.friendId._id.toString() === data.otherUserId);
    if (checkAlreadyFriend) {
      return errRes(res, 400, "userId for accepting as friend is already a friend of current user");
    }
    /* 
      create chatId for both users and add both users in each others friends array
    */

    // user 1 is who initially sent request and user 2 is who accepted that request
    const chat = await Chat.create({ user1: data.otherUserId, user2: userId });

    // create unseen count for both users , set 0 for both users in their unseenMessages for chat._id as mainId
    const ucotherUser = await UnseenCount.create({ userId: data.otherUserId, mainId: chat._id });
    const ucUser = await UnseenCount.create({ userId: userId, mainId: chat._id });

    // remove from notifications and set unseen messages count id
    await Notification.findOneAndUpdate(
      { userId: userId },
      { $pull: { friendRequests: data.otherUserId }, $push: { unseenMessages: ucUser._id } }
    ).exec();

    await Notification.findOneAndUpdate(
      { userId: data.otherUserId },
      { $pull: { friendRequests: userId }, $push: { unseenMessages: ucotherUser._id } }
    ).exec();

    // now add userId in friend list of acceptUserId
    const user1 = await User.findByIdAndUpdate(
      { _id: data.otherUserId },
      { $push: { friends: { friendId: userId, chatId: chat?._id } } },
      { new: true }
    )
      .select({ chatBarOrder: true })
      .exec();

    // now add acceptUserId in friend list of user
    const user2 = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { friends: { friendId: data.otherUserId, chatId: chat?._id } } },
      { new: true }
    )
      .select({ chatBarOrder: true, firstName: true, lastName: true, imageUrl: true, publicKey: true })
      .exec();

    user1?.chatBarOrder.unshift(chat._id.toString());
    await user1?.save();

    user2?.chatBarOrder.unshift(chat._id.toString());
    await user2?.save();

    // Create a new mutex instance
    const newChannel = new Channel();
    // set newmutex for new chatid

    channels.set(chat._id.toString(), newChannel);

    const socketIds = getSingleSocket(data.otherUserId);

    if (socketIds.length > 0 && user2) {
      const sdata: SoRequestAccepted = {
        _id: user2._id.toString(),
        chatId: chat._id.toString(),
        firstName: user2.firstName,
        lastName: user2.lastName,
        imageUrl: user2.imageUrl,
        publicKey: user2.publicKey,
      };
      emitSocketEvent(req, socketIds, clientE.REQUEST_ACCEPTED, sdata);
      emitSocketEvent(req, socketIds, clientE.SET_USER_ONLINE, user2._id.toString());

      // socketId is of other user, now send useronline to myself as other user is online and socketId is present
      // get mysocketId
      const mySocketIds = getSingleSocket(userId);
      if (mySocketIds.length > 0 && user1) {
        emitSocketEvent(req, mySocketIds, clientE.SET_USER_ONLINE, user1._id.toString());
      }
    }

    return res.status(200).json({
      success: true,
      message: "request accepted successfully",
      newFriend: otherUser,
      newChatId: chat._id,
      newFriendPublicKey: otherUser.publicKey,
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
      return errRes(res, 400, `invalid data for deleting request, ${otherUserIdReq.error.toString()}`);
    }

    const data = otherUserIdReq.data;

    await Notification.findOneAndUpdate({ userId: userId }, { $pull: { friendRequests: data.otherUserId } }).exec();

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

    if (!userId) {
      return errRes(res, 400, "user id not present");
    }

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

    if (!notifications) {
      return errRes(res, 500, "error while getting notifications");
    }

    if (notifications?.friendRequests.length === 0 && notifications.unseenMessages.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no notifications for user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "notifications for user",
      userReqs: notifications.friendRequests,
      unseenMessages: notifications.unseenMessages,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting notifications", error);
  }
};

export const createGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    // validation
    if (!userId) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user id not present");
    }

    const createGroupReq = CreateGroupReqSchema.safeParse(req.body);

    if (!createGroupReq.success) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, `invalid data for creating group, ${createGroupReq.data}`);
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
        if (req.file) {
          deleteFile(req.file);
        }
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

    // Create a new mutex instance
    const newChannel = new Channel();
    // set newmutex for new groupId
    channels.set(newGroup._id.toString(), newChannel);

    // set members with groupId
    groupIds.set(newGroup._id.toString(), members);

    await Promise.all(
      members.map(async (userId) => {
        const ucOfGroupMem = await UnseenCount.create({ userId: userId, mainId: newGroup._id });
        await Notification.findOneAndUpdate({ userId: userId }, { $push: { unseenMessages: ucOfGroupMem._id } }).exec();
        const groupUser = await User.findById({ _id: userId });
        groupUser?.chatBarOrder.unshift(newGroup._id.toString());
        await groupUser?.save();
      })
    );

    const memData = getMultiSockets(members, userId);
    const mySocketIds = getSingleSocket(userId);

    // set offline member for group
    groupOffline.set(newGroup._id.toString(), new Set(memData.offline));

    // join groupId room with all online members
    if (mySocketIds.length > 0) {
      req.app.get("io").in(mySocketIds).socketsJoin(newGroup._id.toString());
    }

    if (memData.online.length > 0) {
      req.app.get("io").in(memData.online).socketsJoin(newGroup._id.toString());

      // in online users of group, event is emitted only except for creater, as creater get group in response
      const sdata: SoAddedInGroup = {
        _id: newGroup._id.toString(),
        groupName: data.groupName,
        gpImageUrl: secUrl,
      };
      emitSocketEvent(req, memData.online, clientE.ADDED_IN_GROUP, sdata);
    }

    return res.status(200).json({
      success: true,
      message: "group created successfully",
      newGroup: {
        _id: newGroup._id,
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

export const checkOnlineFriends = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    if (!userId) {
      return errRes(res, 400, "user id not present");
    }

    const userData = await User.findById({ _id: userId }).select({ friends: true }).exec();

    if (userData?.friends.length === undefined || userData?.friends.length < 1) {
      return res.status(200).json({
        success: false,
        message: "user have no friends",
      });
    }

    const onlineFriends: string[] = [];

    userData?.friends.forEach((friend) => {
      const friendId: string = friend.friendId._id.toString();
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
    if (!userId) {
      return errRes(res, 400, "user id not present");
    }

    const setUnseenCountReq = SetUnseenCountReqSchema.safeParse(req.body);

    if (!setUnseenCountReq.success) {
      return errRes(res, 400, `invalid data for setunseencount, ${setUnseenCountReq.error.toString()}`);
    }
    const data = setUnseenCountReq.data;

    await UnseenCount.findOneAndUpdate({ userId: userId, mainId: data.mainId }, { $set: { count: data.count } });

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
    if (!userId) {
      return errRes(res, 400, "user id not present");
    }
    const setOrderReq = SetOrderReqSchema.safeParse(req.body);
    if (!setOrderReq.success) {
      return errRes(res, 400, `invalid data for setunseencount, ${setOrderReq.error.toString()}`);
    }
    const data = setOrderReq.data;
    if (!isValidMongooseObjectId([data.mainId])) {
      return errRes(res, 400, "invalid id for setting order for chatbar");
    }

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
      return errRes(res, 400, `invalid otherUserId for follow req, ${sendFollowRequestReq.error.toString()}`);
    }

    const data = sendFollowRequestReq.data;

    if (userId2 === data.otherUserId) {
      return errRes(res, 400, "userId is same as otherUserId for sending request");
    }

    // check if otherUserId is already followed by user
    const checkAlreadyFollowed = await db
      .select({ id: follow.id })
      .from(follow)
      .where(and(eq(follow.followerId, userId2), eq(follow.followingId, data.otherUserId)))
      .limit(1)
      .execute();

    if (checkAlreadyFollowed.length) {
      return errRes(res, 400, "user already followed other user");
    }

    const insertNewRequest = await db
      .insert(request)
      .values({ fromId: userId2, toId: data.otherUserId })
      .onConflictDoNothing({ target: [request.fromId, request.toId] })
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
      return errRes(res, 400, `invalid data for deleting follow request, ${deleteFollowRequestReq.error.toString()}`);
    }

    const data = deleteFollowRequestReq.data;

    const checkDelete = await db
      .delete(request)
      .where(and(eq(request.fromId, data.otherUserId), eq(request.toId, userId2)))
      .returning({ id: request.id });

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
      return errRes(res, 400, `invalid data for accepting follow request, ${acceptFollowRequestReq.error.toString()}`);
    }

    const data = acceptFollowRequestReq.data;

    if (userId2 === data.otherUserId) {
      return errRes(res, 400, "userId is same as otherUserId for accepting follow request");
    }

    const deleteRequest = await db
      .delete(request)
      .where(and(eq(request.fromId, data.otherUserId), eq(request.toId, userId2)))
      .returning({ id: request.id })
      .execute();

    if (deleteRequest.length !== 1) {
      return errRes(res, 400, "otherUserId for accepting follow request not present in request");
    }

    const followRes = await db
      .insert(follow)
      .values({ followerId: data.otherUserId, followingId: userId2 })
      .onConflictDoNothing({ target: [follow.followerId, follow.followingId] })
      .returning({ id: follow.id })
      .execute();

    // check query response
    if (followRes.length === 0) {
      return errRes(res, 400, "user already followed other user");
    }

    // user is followed by other user, now increase the count of followers for curr user
    await db
      .update(user)
      .set({ followersCount: sql`${user.followersCount} + 1` })
      .where(eq(user.id, userId2));

    // now increase count of following for other user
    await db
      .update(user)
      .set({ followingCount: sql`${user.followingCount} + 1` })
      .where(eq(user.id, data.otherUserId));

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
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        imageUrl: user.imageUrl,
      })
      .from(request)
      .innerJoin(user, eq(request.fromId, user.id))
      .where(eq(request.toId, userId2))
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
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        imageUrl: user.imageUrl,
      })
      .from(user)
      .leftJoin(follow, and(eq(follow.followingId, user.id), eq(follow.followerId, userId2)))
      .leftJoin(request, eq(user.id, request.toId))
      .where(and(isNull(request.toId), isNull(follow.followerId), ne(user.id, userId2)))
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
