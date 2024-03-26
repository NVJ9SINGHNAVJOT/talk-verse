import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    loading: boolean;
    token: string | null;
}

const initialState = {
    loading: false,
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") || '{}')
        : null,
} satisfies AuthState as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
    },
});

export const { setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
