import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    loading: boolean;
    token: string | null;
}

const initialState = {
    loading: false,
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") || '{}')
        : null,
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
    },
});

export const { setLoading, setToken } = userSlice.actions;
export default userSlice.reducer;
