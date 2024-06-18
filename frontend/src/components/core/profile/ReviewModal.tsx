import { postReviewApi } from "@/services/operations/reviewApi";
import { useForm } from "react-hook-form";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";

type ReviewModalProps = {
  setOpenReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserReview = {
  review: string;
};

const ReviewModal = (props: ReviewModalProps) => {
  const { register, handleSubmit } = useForm<UserReview>();

  const postReview = async (data: UserReview) => {
    const reviewText = data.review
      .split(/\r?\n/)
      .filter((value) => value !== "")
      .join(" ");

    if (reviewText) {
      const tid = toast.loading("Posting review");
      props.setOpenReviewModal(false);
      const response = await postReviewApi(reviewText);
      toast.dismiss(tid);

      if (response) {
        toast.success("Review posted");
      } else {
        toast.error("Error while posting review");
      }
    } else {
      toast.info("Invalid input");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 flex justify-center items-center overflow-auto bg-opacity-10 backdrop-blur-lg">
      <form onSubmit={handleSubmit(postReview)} className=" relative flex flex-col w-72 font-be-veitnam-pro ">
        <MdOutlineCancelPresentation
          onClick={() => props.setOpenReviewModal(false)}
          className="w-11 h-8 absolute -top-11 -right-20 fill-white cursor-pointer self-end hover:fill-slate-300 mt-4"
        />
        <label className="text-4xl self-center mb-4 text-violet-500">Review</label>
        <textarea
          className=" outline-none h-32 resize-none rounded-lg p-1 transition-all ease-in-out duration-100
           bg-violet-300 hover:bg-transparent hover:outline hover:outline-offset-1 hover:outline-violet-500
             placeholder:text-violet-500 placeholder:text-sm text-violet-500
            py-3 px-5 focus:text-violet-500 focus:outline focus:outline-offset-1 focus:outline-violet-500"
          {...register("review", {
            required: true,
            minLength: 1,
            maxLength: 150,
          })}
          maxLength={150}
        ></textarea>
        <button
          className="px-6 py-2 mt-10 bg-violet-500 rounded hover:bg-white hover:text-violet-700 font-semibold transition-all
         text-white hover:scale-110"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
