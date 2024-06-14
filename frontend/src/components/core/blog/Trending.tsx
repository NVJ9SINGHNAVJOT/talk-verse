import PostLayout from "@/components/core/blog/post/PostLayout";
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

  useEffect(() => {
    const getPosts = async () => {
      let lastCreatedAt;
      if (trendingPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = trendingPosts[trendingPosts.length - 1].createdAt;
      }

      const response = await trendingPostsApi(lastCreatedAt);
      if (response) {
        if (response.posts) {
          if (response.posts.length < 15) {
            setStop(true);
          }
          setTrendingPosts(response.posts);
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting trending post");
      }
    };
    getPosts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center gap-y-5 overflow-y-scroll">
      {trendingPosts.length !== 0 &&
        trendingPosts.map((post, index) => {
          return (
            <div key={index}>
              <PostLayout post={post} />
            </div>
          );
        })}
    </div>
  );
};

export default Trending;
