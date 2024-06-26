import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import userReducer from "@/redux/slices/userSlice";
import loadingReducer from "@/redux/slices/loadingSlice";
import chatReducer from "@/redux/slices/chatSlice";
import messagesReducer from "@/redux/slices/messagesSlice";
import postReducer from "@/redux/slices/postSlice";
import commonReducer from "@/redux/slices/commonSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  loading: loadingReducer,
  chat: chatReducer,
  messages: messagesReducer,
  post: postReducer,
  common: commonReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
