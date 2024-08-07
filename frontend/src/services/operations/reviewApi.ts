import { CommonRs } from "@/types/apis/common";
import { fetchApi } from "@/services/fetchApi";
import { reviewEndPoints } from "@/services/apis";
import { Reviews } from "@/redux/slices/commonSlice";

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

export const getReviewsApi = async (): Promise<(CommonRs & { reviews: Reviews[] }) | null> => {
  const resData: (CommonRs & { reviews: Reviews[] }) | null = await fetchApi("GET", reviewEndPoints.GET_REVIEWS);
  if (resData) {
    return resData;
  }
  return null;
};
