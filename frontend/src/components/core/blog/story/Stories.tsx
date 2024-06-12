import { getStoriesApi } from "@/services/operations/postApi";
import { Story } from "@/types/apis/postApiRs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const getStories = async () => {
      let lastCreatedAt;
      if (stories.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = stories[stories.length - 1].createdAt;
      }

      const response = await getStoriesApi(lastCreatedAt);
      if (response) {
        if (stories.length === 0) {
          setStories(response.stories);
          return;
        }
        setStories([...stories, ...response.stories]);
      } else {
        toast.error("Error while getting stories");
      }
    };
    getStories();
  }, []);

  return (
    <div className=" ml-6 flex-1 flex overflow-x-auto">
      {stories.length === 0 ? (
        <div className=" mx-auto self-center text-white">It's a busy day</div>
      ) : (
        stories.map((story) => {
          return (
            <div className=" flex flex-col items-center gap-y-2 text-white">
              <img
                alt="Loading..."
                src={story.imageUrl}
                className=" bg-slate-900 cursor-pointer rounded-full size-16 border-[2px]
                 border-whitesmoke"
              />
              <div className=" text-xs">{story.userName}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Stories;
