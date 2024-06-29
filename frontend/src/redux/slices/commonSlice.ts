import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Reviews = {
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  reviewText: string;
};

const data: Reviews[] = [
  {
    reviewText:
      "A Digital Tapestry of Voices. Where connections bloom, effortlessly. Genuine interactions nurture lasting relationships.",
    firstName: "Dronzer",
    lastName: "Beast",
    imageUrl: "images/dronzerBeast.jpg",
  },
  {
    reviewText:
      "Authentic Bonds Flourish. Diverse minds unite. From tech enthusiasts to poets, sparks of creativity ignite.",
    firstName: "Dronzer",
    lastName: "Beast",
    imageUrl: "images/dronzerBeast.jpg",
  },
  {
    reviewText: "Intuitive Navigation. Seamless interface. Focus on meaningful conversations within Talkverse.",
    firstName: "Dronzer",
    lastName: "Beast",
    imageUrl: "images/dronzerBeast.jpg",
  },
  {
    reviewText: "Amplifying Voices. Insights resonate. Empowering users to share and be heard.",
    firstName: "Dronzer",
    lastName: "Beast",
    imageUrl: "images/dronzerBeast.jpg",
  },
];

interface CommonState {
  reviews: Reviews[];
}

const initialState = {
  reviews: data,
} satisfies CommonState as CommonState;

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Reviews[]>) {
      state.reviews.concat(action.payload);
    },
  },
});

export const { setReviews } = commonSlice.actions;
export default commonSlice.reducer;
