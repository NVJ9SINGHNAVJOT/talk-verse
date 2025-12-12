import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { categoryPostsApi } from "@/services/operations/postApi";
import { type Post } from "@/types/apis/postApiRs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PostLayout from "@/components/core/blog/post/PostLayout";
import { useNavigate, useParams } from "react-router-dom";
import MultiCubeLoader from "@/lib/loaders/multicubeloader/MultiCubeLoader";
import { categories } from "@/utils/constants";
import { loadingSliceObject } from "@/redux/slices/loadingSlice";

const Category = () => {
  const { category } = useParams();
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<boolean>(true);
  const categoryContainer = useRef<HTMLDivElement>(null);
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useScrollTriggerVertical(categoryContainer, "down", setTrigger, stop, resetTrigger);

  useEffect(() => {
    return () => {
      setCategoryPosts([]);
      setStop(false);
      setResetTrigger((prev) => !prev);
    };
  }, [category]);

  useEffect(() => {
    const getPosts = async () => {
      if (!category) {
        return;
      }
      if (!categories.includes(category.charAt(0).toUpperCase() + category.slice(1))) {
        navigate("/blog");
        return;
      }
      if (loadingSliceObject.apiCalls[`${category}-category-post`] === true) {
        return;
      }
      loadingSliceObject.apiCalls[`${category}-category-post`] = true;
      let lastCreatedAt;
      if (categoryPosts.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = categoryPosts[categoryPosts.length - 1].createdAt;
      }

      const response = await categoryPostsApi(category, lastCreatedAt);
      loadingSliceObject.apiCalls[`${category}-category-post`] = false;

      if (response) {
        if (response.posts) {
          const withNewPosts = [...categoryPosts, ...response.posts];
          if (location.pathname.includes(response.posts[0].category)) {
            if (response.posts.length < 15) {
              setStop(true);
            }
            setCategoryPosts(withNewPosts);
          }
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting recent post");
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, category]);

  return (
    <div ref={categoryContainer} className="flex h-full w-full flex-col items-center gap-y-5 overflow-y-auto">
      {categoryPosts.length !== 0 ? (
        categoryPosts.map((post, index) => {
          return <PostLayout key={index} post={post} />;
        })
      ) : (
        <MultiCubeLoader className="mt-[35vh]" />
      )}
    </div>
  );
};

export default Category;
