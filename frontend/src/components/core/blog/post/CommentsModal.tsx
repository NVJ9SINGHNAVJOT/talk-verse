import { addCommentApi, postCommentsApi } from "@/services/operations/postApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";
import { Comment } from "@/types/apis/postApiRs";

type AddComment = {
  commentText: string;
};

type CommentsModalProps = {
  id: number;
  setToggleComments: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
};

const CommentsModal = (props: CommentsModalProps) => {
  const divRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const { register, handleSubmit, reset } = useForm<AddComment>();

  const postComment = async (data: AddComment) => {
    reset();
    const response = await addCommentApi(props.id, data.commentText);
    if (!response) {
      toast.error("Error while adding comment");
    }
    props.setCommentsCount((prev) => prev + 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const getComments = async () => {
      let lastCreatedAt;
      if (comments.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = comments[comments.length - 1].createdAt;
      }
      const response = await postCommentsApi(props.id, lastCreatedAt);
      if (response) {
        if (response.comments) {
          setComments(response.comments);
        }
      } else {
        toast.error("Error while getting comments for post");
      }
    };
    getComments();
  }, []);

  return (
    <section className="fixed inset-0 z-50 top-16 backdrop-blur-sm max-w-maxContent">
      <div className="relative w-96 flex flex-col mx-auto mt-24">
        <MdOutlineCancelPresentation
          onClick={() => props.setToggleComments(false)}
          className=" w-11 h-8 absolute -right-24 -top-14 cursor-pointer fill-white hover:fill-slate-300"
        />
        <form onSubmit={handleSubmit(postComment)} className="relative w-10/12">
          <button type="submit" className=" w-0 h-0 absolute -z-10 ">
            Submit
          </button>
          <input
            {...register("commentText", {
              required: true,
              minLength: 1,
              maxLength: 200,
            })}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            autoComplete="off"
            placeholder="Enter Comment Here"
            type="text"
            className="h-12 w-full cursor-default rounded-md border border-gray-800 bg-gray-950 p-3.5 text-gray-100 transition-colors duration-500 placeholder:select-none  placeholder:text-gray-500 focus:border-[#8678F9] focus:outline-none"
          />
          <input
            ref={divRef}
            disabled
            style={{
              border: "1px solid #8678F9",
              opacity,
              WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
            }}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 h-12 w-full cursor-default rounded-md border border-[#8678F9] bg-[transparent] p-3.5 opacity-0  transition-opacity duration-500 placeholder:select-none"
          />
        </form>
      </div>
    </section>
  );
};

export default CommentsModal;
