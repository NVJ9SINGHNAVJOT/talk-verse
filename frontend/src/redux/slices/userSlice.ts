import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
    firstName: string,
    lastName: string,
    imageUrl?: string | null
}

interface UserState {
    user: User | null,
}

const initialState = {
    user: null,
} satisfies UserState as UserState;

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
