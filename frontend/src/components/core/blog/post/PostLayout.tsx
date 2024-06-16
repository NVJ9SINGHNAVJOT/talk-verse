import { deletePostApi, savePostApi, updateLikeApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { BsSaveFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { useEffect, useState } from "react";
import { FileUrl } from "@/components/core/blog/post/CreatePost";
import { validFiles } from "@/utils/constants";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import Comments from "@/components/core/blog/post/Comments";
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
  const [commentsCount, setCommentsCount] = useState<number>();
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
            onClick={() => savePost()}
            className={`size-5 aspect-square cursor-pointer hover:opacity-100 ${isSaved === true ? "opacity-100" : "opacity-40"}`}
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
        <div>
          {post.content.map((line, index) =>
            line === "" ? (
              <br key={index} />
            ) : (
              <div key={index} className=" whitespace-pre text-wrap">
                {line}
              </div>
            )
          )}
        </div>
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
      {toggleComments === true && <Comments id={post.id} setToggleComments={setToggleComments} />}
    </div>
  );
};

export default PostLayout;
