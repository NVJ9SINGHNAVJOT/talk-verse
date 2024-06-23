import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { Post } from "@/types/apis/postApiRs";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import PostLayout from "../blog/post/PostLayout";
import { userPostsApi } from "@/services/operations/profileApi";
import CubeLoader from "@/lib/loaders/cubeloader/CubeLoader";

const MyPosts = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const postContainer = useRef<HTMLDivElement>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useScrollTriggerVertical(postContainer, "down", setTrigger, stop, undefined, loading);

  const removePost = (postId: number) => {
    setMyPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    const getPosts = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (myPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = myPosts[myPosts.length - 1].createdAt;
      }

      const response = await userPostsApi(lastCreatedAt);
      if (response) {
        if (response.posts) {
          const withNewPosts = [...myPosts, ...response.posts];
          if (response.posts.length < 15) {
            setStop(true);
          }
          setMyPosts(withNewPosts);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting my post");
      }
      setLoading(false);
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div ref={postContainer} className="w-full h-full flex flex-col items-center py-12 gap-y-5 overflow-y-auto">
      {myPosts.length !== 0 ? (
        myPosts.map((post, index) => {
          return <PostLayout key={index} post={post} removePost={removePost} />;
        })
      ) : (
        <CubeLoader className=" mt-[35vh]" />
      )}
    </div>
  );
};

export default MyPosts;
