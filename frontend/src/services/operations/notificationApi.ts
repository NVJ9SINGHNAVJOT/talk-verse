import { notificationEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CommonRs } from "@/types/apis/common";
import {
  AcceptRequestRs,
  CheckOnlineFriendsRs,
  CreateGroupRs,
  FollowRequestsRs,
  FollowSuggestionsRs,
  GetAllNotificationsRs,
  GetFollowUsersRs,
  GetUsersRs,
} from "@/types/apis/notificationApiRs";

export const getUsersApi = async (userName: string): Promise<GetUsersRs | null> => {
  const resData: GetUsersRs = await fetchApi("GET", notificationEndPoints.GET_USERS, null, null, {
    userName: userName,
  });
  // success false is used in response
  if (resData) {
    return resData;
  }
  return null;
};

export const getFollowUsersApi = async (userName: string): Promise<GetFollowUsersRs | null> => {
  const resData: GetFollowUsersRs = await fetchApi("GET", notificationEndPoints.GET_FOLLOW_USERS, null, null, {
    userName: userName,
  });
  // success false is used in response
  if (resData) {
    return resData;
  }
  return null;
};

export const sendRequestApi = async (otherUserId: string): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    notificationEndPoints.SEND_REQUEST,
    { otherUserId: otherUserId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const acceptRequestApi = async (otherUserId: string): Promise<AcceptRequestRs | null> => {
  const resData: AcceptRequestRs = await fetchApi(
    "POST",
    notificationEndPoints.ACCEPT_REQUEST,
    { otherUserId: otherUserId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const deleteRequestApi = async (otherUserId: string): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "DELETE",
    notificationEndPoints.DELETE_REQUESET,
    { otherUserId: otherUserId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const getAllNotificationsApi = async (): Promise<GetAllNotificationsRs | null> => {
  const resData: GetAllNotificationsRs = await fetchApi("GET", notificationEndPoints.GET_ALL_NOTIFICATIONS);
  if (resData) {
    return resData;
  }
  return null;
};

export const createGroupApi = async (data: FormData): Promise<CreateGroupRs | null> => {
  const resData: CreateGroupRs = await fetchApi("POST", notificationEndPoints.CREATE_GROUP, data);
  if (resData && resData.success === true) {
    return resData;
  }
  return null;
};

export const addFriendInGroupApi = async (groupId: string, userIdsToBeAdded: string[]): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    notificationEndPoints.ADD_USERS_IN_GROUP,
    {
      groupId: groupId,
      userIdsToBeAdded: userIdsToBeAdded,
    },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const checkOnlineFriendsApi = async (): Promise<CheckOnlineFriendsRs | null> => {
  const resData: CheckOnlineFriendsRs = await fetchApi("GET", notificationEndPoints.CHECK_ONLINE_FRIENDS);
  if (resData) {
    return resData;
  }
  return null;
};

export const setUnseenCount = async (mainId: string, count: number): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    notificationEndPoints.SET_UNSEEN_COUNT,
    { mainId: mainId, count: count },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const setOrderApi = async (mainId: string): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    notificationEndPoints.SET_ORDER,
    { mainId: mainId },
    { "Content-Type": "application/json" }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const sendFollowRequestApi = async (userId: number): Promise<boolean> => {
  const resData = await fetchApi(
    "POST",
    notificationEndPoints.SEND_FOLLOW_REQUEST,
    { otherUserId: userId },
    {
      "Content-Type": "application/json",
    }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const deletFollowRequestApi = async (userId: number): Promise<boolean> => {
  const resData = await fetchApi(
    "DELETE",
    notificationEndPoints.DELETE_FOLLOW_REQUEST,
    { otherUserId: userId },
    {
      "Content-Type": "application/json",
    }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const acceptFollowRequestApi = async (userId: number): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    notificationEndPoints.ACCEPT_FOLLOW_REQUEST,
    {
      otherUserId: userId,
    },
    {
      "Content-Type": "application/json",
    }
  );
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const followRequestsApi = async (): Promise<FollowRequestsRs | null> => {
  const resData: FollowRequestsRs = await fetchApi("GET", notificationEndPoints.FOLLOW_REQUESTS);
  if (resData) {
    return resData;
  }
  return null;
};

export const followSuggestionsApi = async (): Promise<FollowSuggestionsRs | null> => {
  const resData: FollowSuggestionsRs = await fetchApi("GET", notificationEndPoints.FOLLOW_SUGGESTIONS);
  if (resData) {
    return resData;
  }
  return resData;
};
