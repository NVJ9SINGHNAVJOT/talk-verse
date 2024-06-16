import { addCommentApi, deleteCommentApi, postCommentsApi } from "@/services/operations/postApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { MdDeleteForever, MdOutlineCancelPresentation } from "react-icons/md";
import { toast } from "react-toastify";
import { Comment } from "@/types/apis/postApiRs";
import { RxAvatar } from "react-icons/rx";
import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { useAppSelector } from "@/redux/store";

type AddComment = {
  commentText: string;
};

type CommentsModalProps = {
  id: number;
  setToggleComments: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
};

const CommentsModal = (props: CommentsModalProps) => {
  const currUser = useAppSelector((state) => state.user.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const { register, handleSubmit, reset } = useForm<AddComment>();
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);

  useScrollTriggerVertical(commentsContainerRef, "down", setTrigger, stop, undefined, loading);

  const postComment = async (data: AddComment) => {
    reset();
    const response = await addCommentApi(props.id, data.commentText);
    if (!response) {
      toast.error("Error while adding comment");
      return;
    }
    if (!currUser) {
      return;
    }
    const newComment: Comment = {
      id: response.comment.id,
      isCurrentUser: true,
      userId: currUser.id,
      userName: currUser.userName,
      imageUrl: currUser.imageUrl,
      commentText: response.comment.commentText,
      createdAt: response.comment.createdAt,
    };
    comments.unshift(newComment);
    setComments(comments);
    props.setCommentsCount((prev) => prev + 1);
  };

  const deleteComment = async (commentId: number) => {
    const response = await deleteCommentApi(props.id, commentId);
    if (!response) {
      toast.error("Error while deleting comment");
      return;
    }

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    props.setCommentsCount((prev) => prev - 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!inputRef.current || isFocused) return;

    const inp = inputRef.current;
    const rect = inp.getBoundingClientRect();

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
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (comments.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = comments[comments.length - 1].createdAt;
      }

      const response = await postCommentsApi(props.id, lastCreatedAt);

      if (response) {
        if (response.comments) {
          if (response.comments.length < 15) {
            setStop(true);
          }
          if (comments.length !== 0) {
            setComments([...comments, ...response.comments]);
          } else {
            setComments(response.comments);
          }
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting comments for post");
      }
      setLoading(false);
    };
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <section className="fixed inset-0 z-50 top-16 backdrop-blur-[20px] max-w-maxContent overflow-y-auto">
      <div className="relative w-[28rem] lg:w-[38rem] flex flex-col mx-auto mt-16">
        <MdOutlineCancelPresentation
          onClick={() => props.setToggleComments(false)}
          className=" w-11 h-8 absolute -right-14 lm:-right-24 -top-10 cursor-pointer fill-white hover:fill-slate-300"
        />
        <form onSubmit={handleSubmit(postComment)} className="relative w-10/12 self-center">
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
            className="h-12 w-full cursor-default rounded-md border border-gray-800 bg-gray-950 p-3.5 text-gray-100 
            transition-colors duration-500 placeholder:select-none  placeholder:text-gray-500 focus:border-[#8678F9] 
            focus:outline-none"
          />
          <input
            ref={inputRef}
            disabled
            style={{
              border: "1px solid #8678F9",
              opacity,
              WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
            }}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 h-12 w-full cursor-default rounded-md border border-[#8678F9]
             bg-[transparent] p-3.5 opacity-0  transition-opacity duration-500 placeholder:select-none"
          />
        </form>
        <div
          ref={commentsContainerRef}
          className=" flex flex-col gap-y-4 w-full h-[calc(100vh-30vh)] overflow-y-scroll mt-4"
        >
          {comments.length > 0 &&
            comments.map((comment, index) => (
              <div key={index} className="flex flex-col gap-y-[0.2rem] cursor-default">
                <div className="flex">
                  <div>
                    {comment.imageUrl ? (
                      <img alt="Loading..." className=" size-8 rounded-full mr-2" src={comment.imageUrl} />
                    ) : (
                      <RxAvatar className=" size-8 rounded-full mr-2" />
                    )}
                  </div>
                  <p className=" text-[0.9rem] mt-[0.15rem] break-words flex-grow w-fit ">
                    <span className=" text-snow-800 ml-1 mr-4 text-[16px] ">{comment.userName}</span>
                    {comment.commentText}
                  </p>
                </div>
                <div className=" flex justify-between">
                  <div className=" ml-1 text-[13.5px] text-richblack-500 ">{moment(comment.createdAt).fromNow()}</div>
                  {comment.isCurrentUser === true && (
                    <MdDeleteForever
                      onClick={() => deleteComment(comment.id)}
                      className=" size-5 aspect-square cursor-pointer hover:fill-red-600 mr-10 "
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CommentsModal;
