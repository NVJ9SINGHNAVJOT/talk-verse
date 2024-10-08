import PostLayout from "@/components/core/blog/post/PostLayout";
import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import MultiCubeLoader from "@/lib/loaders/multicubeloader/MultiCubeLoader";
import { recentPostsApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Recent = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const postContainer = useRef<HTMLDivElement>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useScrollTriggerVertical(postContainer, "down", setTrigger, stop, undefined, loading);

  useEffect(() => {
    const getPosts = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (recentPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = recentPosts[recentPosts.length - 1].createdAt;
      }

      const response = await recentPostsApi(lastCreatedAt);
      if (response) {
        if (response.posts) {
          const withNewPosts = [...recentPosts, ...response.posts];
          if (response.posts.length < 15) {
            setStop(true);
          }
          setRecentPosts(withNewPosts);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting recent post");
      }
      setLoading(false);
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div ref={postContainer} className="w-full h-full flex flex-col items-center gap-y-5 overflow-y-auto">
      {recentPosts.length !== 0 ? (
        recentPosts.map((post, index) => {
          return <PostLayout key={index} post={post} />;
        })
      ) : (
        <MultiCubeLoader className=" mt-[35vh]" />
      )}
    </div>
  );
};

export default Recent;
