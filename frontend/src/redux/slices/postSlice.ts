import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  userTotalPosts: number;
}

const initialState = {
  userTotalPosts: 0,
} satisfies PostState as PostState;

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setTotalPosts(state, action: PayloadAction<number>) {
      state.userTotalPosts = action.payload;
    },
  },
});

export const { setTotalPosts } = postSlice.actions;
export default postSlice.reducer;
