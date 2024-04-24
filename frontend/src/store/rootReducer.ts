import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import userReducer from "@/store/slices/userSlice";
import pageLoadingReducer from "@/store/slices/pageLoadingSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    pageLoading: pageLoadingReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;