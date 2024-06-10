import { ContactUsQuery } from "@/pages/Contact";
import { fetchApi } from "@/services/fetchApi";
import { queryEndPoints } from "@/services/apis";
import { CommonRs } from "@/types/apis/common";

export const sendQueryApi = async (data: ContactUsQuery): Promise<boolean> => {
  try {
    const resData: CommonRs = await fetchApi("POST", queryEndPoints.SEND_QUERY, data, {
      "Content-Type": "application/json",
    });
    if (resData) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
