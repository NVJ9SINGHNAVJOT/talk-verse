import { setAuthUser } from "@/redux/slices/authSlice";
import { loadingSliceObject } from "@/redux/slices/loadingSlice";
import { messagesSliceObject } from "@/redux/slices/messagesSlice";
import { setUser, setProfile } from "@/redux/slices/userSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

const logOutCleanUp = (dispatch: Dispatch, navigate: NavigateFunction) => {
  dispatch(setAuthUser(false));
  navigate("/login");
  dispatch(setUser(null));
  dispatch(setProfile(null));
  messagesSliceObject.myId = undefined;
  loadingSliceObject.apiCalls["profile"] = false;
};

export default logOutCleanUp;
