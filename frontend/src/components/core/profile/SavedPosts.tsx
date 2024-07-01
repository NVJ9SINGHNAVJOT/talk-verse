import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { userSavedPostsApi } from "@/services/operations/profileApi";
import { Post } from "@/types/apis/postApiRs";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import PostLayout from "@/components/core/blog/post/PostLayout";
import CubeLoader from "@/lib/loaders/cubeloader/CubeLoader";

const SavedPosts = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const postContainer = useRef<HTMLDivElement>(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  useScrollTriggerVertical(postContainer, "down", setTrigger, stop, undefined, loading);

  const removePost = (postId: number) => {
    setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    const getPosts = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (savedPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = savedPosts[savedPosts.length - 1].createdAt;
      }

      const response = await userSavedPostsApi(lastCreatedAt);
      if (response) {
        if (response.posts) {
          const withNewPosts = [...savedPosts, ...response.posts];
          if (response.posts.length < 15) {
            setStop(true);
          }
          setSavedPosts(withNewPosts);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting saved post");
      }
      setLoading(false);
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div
      ref={postContainer}
      className="relative w-full h-full flex flex-col items-center py-12 gap-y-5 overflow-y-auto"
    >
      {savedPosts.length !== 0 ? (
        savedPosts.map((post, index) => {
          return <PostLayout key={index} post={post} removePost={removePost} />;
        })
      ) : (
        <CubeLoader className="absolute left-[45%] top-[35%]" />
      )}
    </div>
  );
};

export default SavedPosts;
