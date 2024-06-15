import { deletePostApi, updateLikeApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { BsSaveFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { useEffect, useState } from "react";
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
    <div className="w-[40rem] flex flex-col gap-y-4 text-white bg-neutral-950 p-2 rounded-xl">
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
      <div className=" flex gap-x-2">
        <button disabled={likeLoading} onClick={() => updateLike()}>
          <FaHeart className={` size-5 ${like === true ? " fill-red-600" : " fill-snow-500"}`} />
        </button>
        <div className=" mr-4 leading-[1.1rem]">{likesCount}</div>
        <button>
          <BiSolidCommentDetail className=" size-5" />
        </button>
        <div className=" mr-4 leading-[1.1rem]">{commentsCount}</div>
      </div>
      {/* open post with comments */}
      {toggleComments === true && (
        <section>
          {post.tags.length > 0 && (
            <div className=" w-full flex gap-x-2 gap-y-1 flex-wrap">
              {post?.tags.map((tag, index) => (
                <div className=" px-3 py-[0.15rem] cursor-default bg-neutral-900 rounded-2xl" key={index}>
                  {"#" + tag}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default PostLayout;
