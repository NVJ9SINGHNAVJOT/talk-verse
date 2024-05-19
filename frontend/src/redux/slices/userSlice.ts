import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
    _id: string,
    firstName: string,
    lastName: string,
    imageUrl?: string | null
    publicKey: string
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
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
