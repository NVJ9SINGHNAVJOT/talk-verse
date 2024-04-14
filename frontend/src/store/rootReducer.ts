import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import userReducer from "@/store/slices/userSlice";

const rootReducer  = combineReducers({
    auth: authReducer,
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;