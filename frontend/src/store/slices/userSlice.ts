import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
    firstName: string,
    lastName: string,
    image: string | null
}

interface ProfileState {
    user: User | null,
}

const initialState = {
    user: null,
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
