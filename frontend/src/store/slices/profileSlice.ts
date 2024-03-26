import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
    firstName : string,
    lastName: string,
    image: string | null
}

interface ProfileState {
    user : User, 
}

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || '{}')
        : null,
} satisfies ProfileState as ProfileState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
