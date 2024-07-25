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
      .filter((value) => value.trim())
      .join(" ")
      .trim();

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
    <div className="fixed inset-0 z-[1000] !mt-0 flex items-center justify-center overflow-auto bg-neutral-950 bg-opacity-70">
      <form onSubmit={handleSubmit(postReview)} className="relative flex w-72 flex-col font-be-veitnam-pro">
        <MdOutlineCancelPresentation
          onClick={() => props.setOpenReviewModal(false)}
          className="absolute -right-20 -top-11 mt-4 h-8 w-11 cursor-pointer self-end fill-white hover:fill-slate-300"
        />
        <label className="mb-4 self-center text-5xl font-semibold text-violet-500">Review</label>
        <textarea
          className="h-32 resize-none rounded-lg bg-violet-300 p-1 px-5 py-3 text-violet-500 outline-none 
          outline outline-offset-1 outline-violet-500 transition-all duration-100 ease-in-out placeholder:text-sm
           placeholder:text-violet-500"
          {...register("review", {
            required: true,
            minLength: 1,
            maxLength: 150,
          })}
          maxLength={150}
        ></textarea>
        <button
          className="mt-10 rounded bg-violet-500 px-6 py-2 font-semibold text-white transition-all 
          hover:scale-110 hover:bg-white hover:text-violet-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
