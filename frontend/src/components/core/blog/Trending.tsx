import PostLayout from "@/components/core/blog/post/PostLayout";
import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import MultiCubeLoader from "@/lib/loaders/multicubeloader/MultiCubeLoader";
import { trendingPostsApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Trending = () => {
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const postContainer = useRef<HTMLDivElement>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  useScrollTriggerVertical(postContainer, "down", setTrigger, stop, undefined, loading);

  const removePost = (postId: number) => {
    setTrendingPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    const getPosts = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (trendingPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = trendingPosts[trendingPosts.length - 1].createdAt;
      }

      const response = await trendingPostsApi(lastCreatedAt);
      if (response) {
        if (response.posts) {
          const withNewPosts = [...trendingPosts, ...response.posts];
          if (response.posts.length < 15) {
            setStop(true);
          }
          setTrendingPosts(withNewPosts);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting trending post");
      }
      setLoading(false);
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div ref={postContainer} className="w-full h-full flex flex-col items-center gap-y-5 overflow-y-auto">
      {trendingPosts.length !== 0 ? (
        trendingPosts.map((post, index) => {
          return <PostLayout key={index} post={post} removePost={removePost} />;
        })
      ) : (
        <MultiCubeLoader className=" mt-[35vh]" />
      )}
    </div>
  );
};

export default Trending;
