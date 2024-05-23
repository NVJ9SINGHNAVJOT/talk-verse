import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
    _id: string,
    firstName: string,
    lastName: string,
    imageUrl?: string | null
    publicKey: string
}

export type Profile = {
    email: string,
    userName: string,
    gender: string,
    countryCode: string,
    contactNumber: number,
    bio: string
}

interface UserState {
    user: User | null,
    profile: Profile | null
}

const initialState = {
    user: null,
    profile: null
} satisfies UserState as UserState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setProfile(state, action: PayloadAction<Profile | null>) {
            state.profile = action.payload;
        },
        setProfileImage(state, action: PayloadAction<string>) {
            if (state.user) {
                state.user.imageUrl = action.payload;
            }
        }
    },
});

export const { setUser, setProfile, setProfileImage } = userSlice.actions;
export default userSlice.reducer;
