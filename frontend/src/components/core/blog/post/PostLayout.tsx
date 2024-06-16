import { deletePostApi, updateLikeApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { BsSaveFill } from "react-icons/bs";
import { MdDeleteForever, MdOutlineCancelPresentation } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { useEffect, useRef, useState } from "react";
import { FileUrl } from "./CreatePost";
import { validFiles } from "@/utils/constants";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";

type PostProps = {
  post: Post;
  // eslint-disable-next-line no-unused-vars
  removePost?: (postId: number) => void;
};

const PostLayout = (props: PostProps) => {
  const post = props.post;
  const divRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [mediaUrls, setMediaUrls] = useState<FileUrl[]>([]);
  const [like, setLike] = useState<boolean>();
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>();
  const [toggleComments, setToggleComments] = useState<boolean>(false);
  const [comments, setComments] = useState();

  const updateLike = async () => {
    setLikeLoading(true);
    const update = like === true ? "delete" : "add";
    const response = await updateLikeApi(props.post.id, update);
    if (response) {
      if (update === "add") {
        setLike(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setLike(false);
        setLikesCount((prev) => prev - 1);
      }
    } else {
      toast.error("Error while updating like");
    }
    setLikeLoading(false);
  };

  const deletePost = async () => {
    const response = await deletePostApi(props.post.id);
    if (response) {
      toast.success("Post deleted");
      if (props.removePost) {
        props.removePost(props.post.id);
      }
    } else {
      toast.error("Error while deleting post");
    }
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
    const postSetUp = () => {
      setLikesCount(props.post.likesCount);
      setCommentsCount(props.post.commentsCount);
      setLike(props.post.isLiked);
    };
    postSetUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.post.mediaUrls.length > 0) {
      const newMediaUrls: FileUrl[] = [];
      props.post.mediaUrls.forEach((url) => {
        const fileExt = url.split(".").pop();
        if (validFiles.image.includes("image/" + fileExt)) {
          newMediaUrls.push({ type: "image", url: url });
        } else {
          newMediaUrls.push({ type: "video", url: url });
        }
      });
      setMediaUrls(newMediaUrls);
    }
  }, [post]);

  return (
    <div className=" relative w-[40rem] flex flex-col gap-y-4 text-white bg-black p-2 rounded-xl">
      {/* top */}
      <div className=" flex justify-between">
        <div className=" flex">
          {post.imageUrl ? (
            <img alt="Loading..." className=" size-10 rounded-full" src={post.imageUrl} />
          ) : (
            <RxAvatar className=" size-10 rounded-full" />
          )}
          <div className=" flex flex-col text-xs ml-2 justify-between">
            <p className=" text-[0.9rem]">{post.firstName + " " + post.lastName}</p>
            <p className=" text-snow-800">{post.userName}</p>
          </div>
        </div>
        {post?.isCurrentUser ? (
          <MdDeleteForever
            onClick={() => deletePost()}
            className=" size-5 aspect-square cursor-pointer hover:fill-snow-800 "
          />
        ) : (
          <BsSaveFill
            className={`size-5 aspect-square cursor-pointer ${post.isSaved && " opacity-45"} hover:fill-snow-800 `}
          />
        )}
      </div>
      {/* middle */}
      {mediaUrls.length > 0 && <MediaFiles className=" w-11/12 h-60 self-center" mediaUrls={mediaUrls} />}
      {/* bottom */}
      {post.title !== undefined && (
        <div
          className=" truncate text-xl className='inline-flex animate-text-gradient bg-gradient-to-r from-[#b2a8fd]
         via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-transparent font-[450]"
        >
          {post.title}
        </div>
      )}
      {post.content.length > 0 && (
        <div>{post.content.map((line, index) => (line === "" ? <br /> : <div key={index}>{line}</div>))}</div>
      )}
      {post.tags.length > 0 && (
        <div className=" w-full flex gap-x-2 gap-y-1 flex-wrap">
          {post?.tags.map((tag, index) => (
            <div key={index} className=" cursor-default text-blue-500 ">
              {"#" + tag}
            </div>
          ))}
        </div>
      )}
      <div className=" flex gap-x-2">
        <button disabled={likeLoading} onClick={() => updateLike()}>
          <FaHeart className={` size-5 ${like === true ? " fill-red-600" : " fill-snow-500"}`} />
        </button>
        <div className=" mr-4 leading-[1.1rem]">{likesCount}</div>
        <button onClick={() => setToggleComments(true)}>
          <BiSolidCommentDetail className=" size-5" />
        </button>
        <div className=" mr-4 leading-[1.1rem]">{commentsCount}</div>
      </div>
      {/* open post comments */}
      {toggleComments === true && (
        <section className="fixed inset-0 z-50 top-16 backdrop-blur-sm max-w-maxContent">
          <div className="relative w-72 flex flex-col mx-auto mt-24">
            <MdOutlineCancelPresentation
              onClick={() => setToggleComments(false)}
              className=" w-11 h-8 absolute -right-24 -top-14 cursor-pointer fill-white hover:fill-slate-300"
            />
            <div className="relative w-10/12">
              <input
                onMouseMove={handleMouseMove}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                autoComplete="off"
                placeholder="Enter Text Here"
                type="email"
                name="email"
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
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PostLayout;
