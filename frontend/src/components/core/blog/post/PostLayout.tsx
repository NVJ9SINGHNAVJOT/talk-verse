import { deletePostApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { BsSaveFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";
import MediaFiles from "@/components/core/blog/media/MediaFiles";
import { useEffect, useState } from "react";
import { FileUrl } from "./CreatePost";
import { validFiles } from "@/utils/constants";

type PostProps = {
  post: Post;
  removePost?: (postId: number) => void;
};

const PostLayout = (props: PostProps) => {
  const [mediaUrls, setMediaUrls] = useState<FileUrl[]>([]);
  const post = props.post;

  const deletePost = async () => {
    const response = await deletePostApi(post.id);
    if (response) {
      if (props.removePost) {
        props.removePost(post.id);
      }
      toast.success("Post deleted");
    } else {
      toast.error("Error while deleting post");
    }
  };

  useEffect(() => {
    const checkMediaUrls = () => {
      if (post.mediaUrls.length > 0) {
        const newMediaUrls: FileUrl[] = [];
        post.mediaUrls.forEach((url) => {
          const fileExt = url.split(".").pop();
          if (validFiles.image.includes("image/" + fileExt)) {
            newMediaUrls.push({ type: "image", url: url });
          } else {
            newMediaUrls.push({ type: "video", url: url });
          }
        });
        setMediaUrls(newMediaUrls);
      }
    };
    checkMediaUrls();
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
        {post.isCurrentUser ? (
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
      {post.tags.length > 0 && (
        <div className=" w-full flex gap-x-2 gap-y-1 flex-wrap">
          {post.tags.map((tag) => (
            <div>{"#" + tag}</div>
          ))}
        </div>
      )}
      {}
    </div>
  );
};

export default PostLayout;
