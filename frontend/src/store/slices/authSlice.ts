import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    loading: boolean;
    isLogin: boolean;
    authUser: boolean;
}

const initialState = {
    loading: false,
    isLogin: false,
    authUser: false,
} satisfies AuthState as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setIsLogin(state, action: PayloadAction<boolean>) {
            state.isLogin = action.payload;
        },
        setAuthUser(state, action: PayloadAction<boolean>) {
            state.authUser = action.payload;
        }
    },
});

export const { setLoading, setIsLogin, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
