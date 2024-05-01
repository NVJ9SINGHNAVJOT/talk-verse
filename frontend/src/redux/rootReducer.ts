import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import userReducer from "@/redux/slices/userSlice";
import pageLoadingReducer from "@/redux/slices/pageLoadingSlice";
import chatReducer from "@/redux/slices/chatSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    pageLoading: pageLoadingReducer,
    chat: chatReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;