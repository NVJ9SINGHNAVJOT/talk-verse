import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ReviewsSliceObject = {
  reviewApiEnd: boolean;
};
// NOTE: object below contains properties for reference only, not used for state rendering
export const reviewsSliceObject: ReviewsSliceObject = {
  reviewApiEnd: false,
};

export type Review = {
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  reviewText: string;
};

const data: Review[] = [
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

interface ReviewsState {
  reviews: Review[];
}

const initialState = {
  reviews: data,
} satisfies ReviewsState as ReviewsState;

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Review[]>) {
      state.reviews.concat(action.payload);
    },
  },
});

export const { setReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
