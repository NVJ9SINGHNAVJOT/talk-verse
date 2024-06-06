import { notificationEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import { CreateGroupRs } from "@/types/apis/chatApiRs";
import { CommonRs } from "@/types/apis/common";
import {
  AcceptRequestRs,
  CheckOnlineFriendsRs,
  GetAllNotificationsRs,
  GetUsersRs,
} from "@/types/apis/notificationApiRs";

export const getUsersApi = async (userName: string): Promise<GetUsersRs> => {
  try {
    const resData: GetUsersRs = await fetchApi("GET", notificationEndPoints.GET_USERS, null, null, {
      userName: userName,
    });
    // success false is used in response
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const sendRequestApi = async (otherUserId: string): Promise<boolean> => {
  try {
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
  } catch (error) {
    return false;
  }
};

export const acceptRequestApi = async (otherUserId: string): Promise<AcceptRequestRs> => {
  try {
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
  } catch (error) {
    return null;
  }
};

export const deleteRequestApi = async (otherUserId: string): Promise<boolean> => {
  try {
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
  } catch (error) {
    return false;
  }
};

export const getAllNotificationsApi = async (): Promise<GetAllNotificationsRs> => {
  try {
    const resData: GetAllNotificationsRs = await fetchApi("GET", notificationEndPoints.GET_ALL_NOTIFICATIONS);
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const createGroupApi = async (data: FormData): Promise<CreateGroupRs> => {
  try {
    const resData: CreateGroupRs = await fetchApi("POST", notificationEndPoints.CREATE_GROUP, data);
    if (resData && resData.success === true) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const checkOnlineFriendsApi = async (): Promise<CheckOnlineFriendsRs> => {
  try {
    const resData: CheckOnlineFriendsRs = await fetchApi("GET", notificationEndPoints.CHECK_ONLINE_FRIENDS);
    if (resData) {
      return resData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const setUnseenCount = async (mainId: string, count: number): Promise<boolean> => {
  try {
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
  } catch (error) {
    return false;
  }
};

export const setOrderApi = async (mainId: string): Promise<boolean> => {
  try {
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
  } catch (error) {
    return false;
  }
};
