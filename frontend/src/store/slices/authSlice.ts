import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    loading: boolean;
    token: string | null;
    isLogin: boolean;
}

const initialState = {
    loading: false,
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") || '{}')
        : null,
    isLogin: false,
} satisfies UserState as UserState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        setIsLogin(state, action: PayloadAction<boolean>) {
            state.isLogin = action.payload;
        }
    },
});

export const { setLoading, setToken, setIsLogin } = userSlice.actions;
export default userSlice.reducer;
