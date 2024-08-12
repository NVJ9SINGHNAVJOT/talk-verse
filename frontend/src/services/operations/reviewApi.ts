import { CommonRs } from "@/types/apis/common";
import { fetchApi } from "@/services/fetchApi";
import { reviewEndPoints } from "@/services/apis";
import { Review } from "@/redux/slices/reviewsSlice";

export const postReviewApi = async (reviewText: string): Promise<boolean> => {
  const resData: CommonRs = await fetchApi(
    "POST",
    reviewEndPoints.POST_REVIEW,
    { reviewText: reviewText },
    {
      "Content-Type": "application/json",
    }
  );
  if (resData) {
    return true;
  }
  return false;
};

export const getReviewsApi = async (): Promise<(CommonRs & { reviews: Review[] }) | null> => {
  const resData: (CommonRs & { reviews: Review[] }) | null = await fetchApi("GET", reviewEndPoints.GET_REVIEWS);
  if (resData) {
    return resData;
  }
  return null;
};
