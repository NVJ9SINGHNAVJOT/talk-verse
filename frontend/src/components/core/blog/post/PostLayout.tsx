import { Post } from "@/types/apis/postApiRs";
import { RxAvatar } from "react-icons/rx";

type PostProps = {
  post: Post;
};

const PostLayout = (props: PostProps) => {
  const post = props.post;
  return (
    <div className="w-[40rem] flex flex-col gap-y-4 text-white">
      {/* top */}
      <div className=" flex justify-between">
        <div className=" flex">
          {post.imageUrl ? (
            <img className=" size-10 rounded-full" src={post.imageUrl} />
          ) : (
            <RxAvatar className=" size-10 rounded-full" />
          )}
          <div className=" flex flex-col text-xs ml-2 justify-between">
            <p className=" text-[0.9rem]">{post.firstName + " " + post.lastName}</p>
            <p className=" text-snow-800" >{post.userName}</p>
          </div>
        </div>
        <div>sdfs</div>
      </div>
    </div>
  );
};

export default PostLayout;
