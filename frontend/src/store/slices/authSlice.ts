import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    loading: boolean;
    isLogin: boolean;
}

const initialState = {
    loading: false,
    isLogin: false,
} satisfies UserState as UserState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setIsLogin(state, action: PayloadAction<boolean>) {
            state.isLogin = action.payload;
        }
    },
});

export const { setLoading, setIsLogin } = userSlice.actions;
export default userSlice.reducer;
