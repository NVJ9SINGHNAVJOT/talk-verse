import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import userReducer from "@/redux/slices/userSlice";
import pageLoadingReducer from "@/redux/slices/pageLoadingSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    pageLoading: pageLoadingReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;