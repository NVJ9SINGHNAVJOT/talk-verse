import { deletePostApi, savePostApi, updateLikeApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { BsSaveFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import moment from "moment";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { useEffect, useState } from "react";
import { FileUrl } from "@/components/core/blog/post/CreatePost";
import { validFiles } from "@/utils/constants";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import CommentsModal from "@/components/core/blog/post/CommentsModal";
import { useDispatch } from "react-redux";
import { updateTotalPosts } from "@/redux/slices/postSlice";

type PostProps = {
  post: Post;
  // eslint-disable-next-line no-unused-vars
  removePost?: (postId: number) => void;
};

const PostLayout = (props: PostProps) => {
  const post = props.post;

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [mediaUrls, setMediaUrls] = useState<FileUrl[]>([]);
  const [like, setLike] = useState<boolean>();
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [toggleComments, setToggleComments] = useState<boolean>(false);
  const dispatch = useDispatch();

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
        dispatch(updateTotalPosts(-1));
        props.removePost(props.post.id);
      }
    } else {
      toast.error("Error while deleting post");
    }
  };

  const savePost = async () => {
    const response = await savePostApi(props.post.id, isSaved === true ? "remove" : "add");
    if (!response) {
      toast.error("Error while saving post");
      return;
    }

    if (isSaved) {
      toast.success("Post removed");
      setIsSaved(false);
    } else {
      toast.success("Post saved");
      setIsSaved(true);
    }
  };

  useEffect(() => {
    const postSetUp = () => {
      setIsSaved(props.post.isSaved);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  return (
    <div className="relative flex w-10/12 max-w-[44rem] flex-col gap-y-4 rounded-xl bg-black p-3 text-white">
      {/* top */}
      <div className="flex justify-between">
        <div className="flex">
          {post.imageUrl ? (
            <img alt="Loading..." className="size-10 rounded-full" src={post.imageUrl} />
          ) : (
            <RxAvatar className="size-10 rounded-full" />
          )}
          <div className="ml-2 flex flex-col justify-between text-xs">
            <p className="text-[0.9rem]">{post.firstName + " " + post.lastName}</p>
            <p className="text-snow-800">{post.userName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          {post.isCurrentUser ? (
            <button type="button" className="group relative">
              <MdDeleteForever
                onClick={() => deletePost()}
                className="aspect-square size-5 scale-[1.25] cursor-pointer hover:fill-red-400 hover:opacity-100"
              />
              {/* tooltip for delete */}
              <div className="opacity-0 transition-all duration-300 ease-in group-hover:block group-hover:opacity-100">
                <div
                  className="pointer-events-none absolute top-1/2 flex -translate-x-4 -translate-y-1/2 items-center
                 rounded-sm text-center text-sm text-slate-300 transition-all duration-500 ease-in-out before:-top-2 
                 group-hover:-translate-x-[6.7rem]"
                >
                  <div className="border-[2px] border-red-400">
                    <div className="cursor-pointer items-center rounded-md bg-red-950 fill-red-400 duration-100 active:border">
                      <p className="text-nowrap px-2 py-[0.20rem] text-[0.8rem] font-bold leading-4 text-red-400">
                        Delete Post
                      </p>
                    </div>
                  </div>
                  <div className="h-0 w-fit border-b-8 border-l-8 border-t-8 border-transparent border-l-red-400"></div>
                </div>
              </div>
            </button>
          ) : (
            <button type="button" className="group relative">
              <BsSaveFill
                onClick={() => savePost()}
                className={`aspect-square size-5 cursor-pointer hover:opacity-100 ${isSaved === true ? "fill-lime-400" : "opacity-70"}`}
              />
              {/* tooltip for save */}
              <div className="opacity-0 transition-all duration-300 ease-in group-hover:block group-hover:opacity-100">
                <div
                  className="pointer-events-none absolute top-1/2 flex -translate-x-4 -translate-y-1/2 items-center 
                rounded-sm text-center text-sm text-slate-300 transition-all duration-500 ease-in-out before:-top-2 
                group-hover:-translate-x-[6.35rem]"
                >
                  <div className="border-[2px] border-lime-400">
                    <div className="cursor-pointer items-center rounded-md bg-lime-950 fill-lime-400 duration-100 active:border">
                      <p className="text-nowrap px-2 py-[0.20rem] text-[0.8rem] font-bold leading-4 text-lime-400">
                        Save Post
                      </p>
                    </div>
                  </div>
                  <div className="h-0 w-fit border-b-8 border-l-8 border-t-8 border-transparent border-l-lime-400"></div>
                </div>
              </div>
            </button>
          )}
          <div className="text-xs text-snow-800">{moment(post.createdAt).fromNow()}</div>
        </div>
      </div>
      {/* middle */}
      {mediaUrls.length > 0 && <MediaFiles className="h-60 w-11/12 self-center" mediaUrls={mediaUrls} />}
      {/* bottom */}
      {post.title !== undefined && (
        <div
          className="className='inline-flex animate-text-gradient truncate bg-gradient-to-r from-[#b2a8fd] 
        via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-xl font-[450] text-transparent"
        >
          {post.title}
        </div>
      )}
      {post.content.length > 0 && (
        <div>
          {post.content.map((line, index) =>
            line === "" ? (
              <br key={index} />
            ) : (
              <div key={index} className="max-w-full whitespace-pre text-wrap break-words">
                {line}
              </div>
            )
          )}
        </div>
      )}
      {post.tags.length > 0 && (
        <div className="flex w-full flex-wrap gap-x-2 gap-y-1">
          {post?.tags.map((tag, index) => (
            <div key={index} className="max-w-full cursor-default text-wrap break-words text-blue-500">
              {"#" + tag}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-x-2">
        <button disabled={likeLoading} onClick={() => updateLike()}>
          <FaHeart className={`size-5 ${like === true ? "fill-red-600" : "fill-snow-500"}`} />
        </button>
        <div className="mr-4 leading-[1.1rem]">{likesCount}</div>
        <button onClick={() => setToggleComments(true)}>
          <BiSolidCommentDetail className="size-5" />
        </button>
        <div className="mr-4 leading-[1.1rem]">{commentsCount}</div>
      </div>
      {/* open post comments */}
      {toggleComments === true && (
        <CommentsModal id={post.id} setToggleComments={setToggleComments} setCommentsCount={setCommentsCount} />
      )}
    </div>
  );
};

export default PostLayout;
