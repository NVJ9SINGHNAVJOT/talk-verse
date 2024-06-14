import { useScrollTriggerHorizontal } from "@/hooks/useScrollTrigger";
import { CanvasReveal } from "@/lib/sections/CanvasReveal";
import { getStoriesApi } from "@/services/operations/postApi";
import { Story } from "@/types/apis/postApiRs";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineCancelPresentation } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [storyIndex, setStoryIndex] = useState<number>(-1);
  const [stop, setStop] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  useScrollTriggerHorizontal(storiesContainerRef, setTrigger, stop, undefined, loading);

  const scrollStories = (direction: "left" | "right") => {
    if (storiesContainerRef.current) {
      if (direction === "left") {
        storiesContainerRef.current.scrollLeft -= storiesContainerRef.current.clientWidth / 2;
      } else {
        storiesContainerRef.current.scrollLeft += storiesContainerRef.current.clientWidth / 2;
      }
    }
  };

  const shiftStory = (shift: "previous" | "next") => {
    if (shift === "previous") {
      if (storyIndex === -1 || storyIndex === 0) {
        return;
      }
      setStoryIndex((prev) => prev - 1);
    } else {
      if (storyIndex === -1 || storyIndex === stories.length - 1) {
        return;
      }
      setStoryIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const getStories = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      let lastCreatedAt;
      if (stories.length === 0) {
        lastCreatedAt = new Date().toISOString();
      } else {
        lastCreatedAt = stories[stories.length - 1].createdAt;
      }

      const response = await getStoriesApi(lastCreatedAt);

      if (response) {
        if (response.stories) {
          if (response.stories.length < 15) {
            setStop(true);
          }
          if (stories.length === 0) {
            setStories(response.stories);
          } else {
            setStories([...stories, ...response.stories]);
          }
        }
      } else {
        toast.error("Error while getting stories");
      }
      setLoading(false);
    };
    getStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div className="relative w-full flex ml-5">
      <div className={`${stories.length === 0 ? "block" : "hidden"} mx-auto self-center text-white`}>
        It's a busy day
      </div>
      <div className={`w-full ${stories.length === 0 ? "hidden" : "flex"} justify-between items-center`}>
        <MdKeyboardArrowLeft onClick={() => scrollStories("left")} className=" size-10 fill-white cursor-pointer" />
        {/* FIXME: in below div if w-1 is removed then overflow properties dosn't work, for now w-1 is used with flex grow */}
        <div ref={storiesContainerRef} className="flex flex-grow w-1 gap-x-3 overflow-x-auto scroll-smooth">
          {stories.map((story, index) => {
            return (
              <div key={index} className=" flex flex-col items-center gap-y-2 text-white">
                {story.imageUrl ? (
                  <img
                    onClick={() => setStoryIndex(index)}
                    alt="Loading..."
                    src={story.imageUrl}
                    className=" bg-slate-900 cursor-pointer rounded-full size-16 border-[2px]
                    border-whitesmoke"
                  />
                ) : (
                  <RxAvatar
                    onClick={() => setStoryIndex(index)}
                    className=" bg-slate-900 cursor-pointer rounded-full size-16 border-[2px]
                  border-whitesmoke"
                  />
                )}
                <div className=" text-xs w-16 truncate text-center mb-2">{story.userName}</div>
              </div>
            );
          })}
        </div>
        <MdKeyboardArrowRight onClick={() => scrollStories("right")} className=" size-10 fill-white cursor-pointer" />
      </div>

      {/* story view */}
      {storyIndex !== -1 && (
        <section className="fixed inset-0 z-50 top-16 backdrop-blur-sm max-w-maxContent">
          <div
            className=" relative mx-auto w-72 h-[28rem] border-[2px]
           border-whitesmoke mt-20 text-white flex items-center "
          >
            <MdKeyboardArrowLeft
              onClick={() => shiftStory("previous")}
              className=" absolute z-[100] -left-32 size-24 cursor-pointer "
            />
            <MdKeyboardArrowRight
              onClick={() => shiftStory("next")}
              className=" absolute z-[100] -right-32 size-24 cursor-pointer "
            />
            <MdOutlineCancelPresentation
              onClick={() => setStoryIndex(-1)}
              className=" absolute z-[100] -right-16 -top-16 cursor-pointer w-11 h-8 fill-white hover:fill-slate-300"
            />
            <div className=" absolute z-[100] w-full h-full flex flex-col items-center justify-center bg-neutral-950">
              <div className=" absolute self-start top-0 mt-1 ml-1 flex gap-x-2 items-center">
                {stories[storyIndex].imageUrl ? (
                  <img alt="" className="size-8 rounded-full" src={stories[storyIndex].imageUrl} />
                ) : (
                  <RxAvatar className="size-8 rounded-full" />
                )}

                <div className=" text-xs">{stories[storyIndex].userName}</div>
              </div>
              {stories[storyIndex].storyUrl.includes("image/") ? (
                <img alt="Loading..." src={stories[storyIndex].storyUrl} />
              ) : (
                <video src={stories[storyIndex].storyUrl} />
              )}
            </div>
          </div>
          {/* canvas effect */}
          <AnimatePresence>
            <div className="h-full w-full absolute inset-0">
              <CanvasReveal
                animationSpeed={5}
                containerClassName="bg-transparent"
                colors={[
                  [59, 130, 246],
                  [139, 92, 246],
                ]}
                opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                dotSize={2}
              />
            </div>
          </AnimatePresence>
        </section>
      )}
    </div>
  );
};

export default Stories;
