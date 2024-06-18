import { useScrollTriggerVertical } from "@/hooks/useScrollTrigger";
import { categoryPostsApi } from "@/services/operations/postApi";
import { Post } from "@/types/apis/postApiRs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PostLayout from "@/components/core/blog/post/PostLayout";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setApiCall } from "@/redux/slices/loadingSlice";
import MultiCubeLoader from "@/lib/loaders/multicubeloader/MultiCubeLoader";

const Category = () => {
  const apiCalls = useAppSelector((state) => state.loading.apiCalls);
  const { category } = useParams();
  const [stop, setStop] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<boolean>(true);
  const categoryContainer = useRef<HTMLDivElement>(null);
  const [categoriesPost, setCategoriesPost] = useState<Post[]>([]);
  const dispatch = useDispatch();

  useScrollTriggerVertical(categoryContainer, "down", setTrigger, stop, resetTrigger);

  const removePost = (postId: number) => {
    setCategoriesPost((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    return () => {
      setCategoriesPost([]);
      setStop(false);
      setResetTrigger((prev) => !prev);
    };
  }, [category]);

  useEffect(() => {
    const getPosts = async () => {
      if (!category || apiCalls[`${category}category-post`] === true) {
        return;
      }
      dispatch(setApiCall({ api: `${category}category-post`, status: true }));
      let lastCreatedAt;
      if (categoriesPost.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = categoriesPost[categoriesPost.length - 1].createdAt;
      }

      const response = await categoryPostsApi(category, lastCreatedAt);
      if (response) {
        if (response.posts) {
          const withNewPosts = [...categoriesPost, ...response.posts];
          if (category === response.posts[0].category) {
            if (response.posts.length < 15) {
              setStop(true);
            }
            setCategoriesPost(withNewPosts);
          }
        } else {
          setStop(true);
        }
      } else {
        toast.error("Error while getting recent post");
      }
      dispatch(setApiCall({ api: `${category}category-post`, status: false }));
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, category]);

  return (
    <div ref={categoryContainer} className="w-full h-full flex flex-col items-center gap-y-5 overflow-y-auto">
      {categoriesPost.length !== 0 ? (
        categoriesPost.map((post, index) => {
          return <PostLayout key={index} post={post} removePost={removePost} />;
        })
      ) : (
        <MultiCubeLoader className=" mt-[35vh]" />
      )}
    </div>
  );
};

export default Category;
