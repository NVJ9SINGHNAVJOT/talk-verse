import CreatePost from "@/components/core/blog/post/CreatePost";
import CreateStory from "@/components/core/blog/story/CreateStory";
import Stories from "@/components/core/blog/story/Stories";
import SearchModal from "@/components/common/SearchModal";
import { useOnClickOutsideBlog } from "@/hooks/useOnClickOutside";
import TalkVerseButton from "@/lib/buttons/talkversebutton/TalkVerseButton";
import { CanvasReveal } from "@/lib/sections/CanvasReveal";
import { setTotalPosts } from "@/redux/slices/postSlice";
import { useAppSelector } from "@/redux/store";
import {
  acceptFollowRequestApi,
  deletFollowRequestApi,
  followRequestsApi,
  followSuggestionsApi,
  sendFollowRequestApi,
} from "@/services/operations/notificationApi";
import { deleteStoryApi, userStoryApi } from "@/services/operations/postApi";
import { userBlogProfileApi } from "@/services/operations/profileApi";
import { type UserSuggestion } from "@/types/apis/notificationApiRs";
import { type UserStory } from "@/types/apis/postApiRs";
import { categories } from "@/utils/constants";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { HiOutlineUserAdd } from "react-icons/hi";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Blog = () => {
  const user = useAppSelector((state) => state.user.user);
  const userPosts = useAppSelector((state) => state.post.userTotalPosts);
  const [following, setFollowing] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [postMenu, setPostMenu] = useState<string>();
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [followRequests, setFollowRequests] = useState<UserSuggestion[]>([]);
  const [sendingReq, setSendingReq] = useState<number[]>([]);
  const [answeringReq, setAnsweringReq] = useState<number[]>([]);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [createStory, setCreateStory] = useState<boolean>(false);
  const [storyLoading, setStoryLoading] = useState<boolean>(true);
  const [userStory, setUserStory] = useState<UserStory>();
  const [viewStory, setViewStory] = useState<boolean>(false);
  const [sideMenu, setSideMenu] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sideSectionRef = useRef<HTMLDivElement>(null);
  const excludeTalkVerseButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useOnClickOutsideBlog(sideSectionRef, () => setSideMenu(false), sideMenu, excludeTalkVerseButtonRef);

  const sendFollowRequest = async (reqUserId: number): Promise<boolean> => {
    setSendingReq([...sendingReq, reqUserId]);
    const response = await sendFollowRequestApi(reqUserId);
    if (response) {
      setSuggestions((prev) => prev.filter((user) => user.id !== reqUserId));
      toast.success("Follow request send successfully");
      setSendingReq((prev) => prev.filter((otherUserId) => otherUserId !== reqUserId));
      return true;
    }
    toast.error("Error while sending request");
    setSendingReq((prev) => prev.filter((otherUserId) => otherUserId !== reqUserId));
    return false;
  };

  const acceptRequest = async (reqUserId: number) => {
    setAnsweringReq([...answeringReq, reqUserId]);
    const response = await acceptFollowRequestApi(reqUserId);
    if (response) {
      setFollowRequests((prev) => prev.filter((user) => user.id != reqUserId));
      setFollowers((prev) => prev + 1);
      toast.success("New follower added");
    } else {
      toast.error("Error while adding follower");
    }
    setAnsweringReq((prev) => prev.filter((otherUserId) => otherUserId !== reqUserId));
  };

  const deleteRequest = async (reqUserId: number) => {
    setAnsweringReq([...answeringReq, reqUserId]);
    const response = await deletFollowRequestApi(reqUserId);
    if (response) {
      setFollowRequests((prev) => prev.filter((user) => user.id != reqUserId));
    } else {
      toast.error("Error while adding follower");
    }
    setAnsweringReq((prev) => prev.filter((otherUserId) => otherUserId !== reqUserId));
  };

  const deleteStory = async () => {
    setStoryLoading(true);
    setViewStory(false);

    if (userStory) {
      const response = await deleteStoryApi(userStory.id);
      if (response) {
        setUserStory(undefined);
        toast.success("Story deleted");
      } else {
        toast.error("Error while deleting story");
      }
    }
    setStoryLoading(false);
  };

  const getSuggestions = async () => {
    const response = await followSuggestionsApi();
    if (response) {
      if (response.suggestions?.length) {
        setSuggestions(response.suggestions);
      }
    } else {
      toast.error("Error while getting followSuggestions");
    }
  };

  const getFollowRequests = async () => {
    const response = await followRequestsApi();
    if (response) {
      if (response.followRequests) {
        setFollowRequests(response.followRequests);
      }
    } else {
      toast.error("Error while getting follow requests");
    }
  };

  const getBlogProfile = async () => {
    const response = await userBlogProfileApi();
    if (response) {
      setFollowers(response.blogProfile.followersCount);
      setFollowing(response.blogProfile.followingCount);
      dispatch(setTotalPosts(response.blogProfile.totalPosts));
    } else {
      toast.error("Error while getting blogProfie data");
      navigate("/error");
    }
  };

  const getUserStory = async () => {
    const response = await userStoryApi();
    if (response) {
      if (response.success === true && response.story) {
        setUserStory(response.story);
      }
    } else {
      toast.error("Error while checking user story");
    }
    setStoryLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getSuggestions(), getFollowRequests(), getBlogProfile(), getUserStory()]);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const title = location.pathname.split("/").pop();
    if (title === "blog") {
      setPostMenu("trending");
    } else {
      setPostMenu(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full min-w-minContent">
      {/* user profile and category section  */}
      <section className="flex h-full w-36 flex-col bg-[#030609] px-1 md:w-48">
        {/* user profile details */}
        <div className="mt-4 flex flex-col items-center gap-y-1 font-be-veitnam-pro text-snow-200">
          {user?.imageUrl ? (
            <img src={user?.imageUrl} alt="Loading..." className="size-20 object-cover rounded-full" />
          ) : (
            <RxAvatar className="aspect-auto size-20 w-full rounded-full fill-slate-500" />
          )}
          {user && <p className="text-[1rem]">{user?.firstName + " " + user?.lastName}</p>}
          {user && <p className="text-[0.8rem]">{user.userName}</p>}
          <div className="mt-2 flex w-full flex-col gap-y-2 md:mt-5 md:flex-row md:justify-between md:gap-y-0">
            <div
              onClick={() => navigate("/profile/myposts")}
              className="flex cursor-pointer flex-col items-center md:ml-1"
            >
              <p className="leading-4">{userPosts}</p>
              <p className="text-xs leading-3">Post</p>
            </div>
            <div onClick={() => navigate("/profile/followers")} className="flex cursor-pointer flex-col items-center">
              <p className="leading-4">{followers}</p>
              <p className="text-xs leading-3">Followers</p>
            </div>
            <div
              onClick={() => navigate("/profile/following")}
              className="flex cursor-pointer flex-col items-center md:mr-1"
            >
              <p className="leading-4">{following}</p>
              <p className="text-xs leading-3">Following</p>
            </div>
          </div>
          <div className="mt-2 w-10/12 border-[1px] border-dashed border-snow-500"></div>
        </div>
        <div ref={excludeTalkVerseButtonRef} onClick={() => setSideMenu((prev) => !prev)} className="lm:hidden">
          <TalkVerseButton className="mx-auto mt-2 h-6 w-10/12 md:h-8" />
        </div>
        {/* posts categories */}
        <div className="my-6 flex flex-col items-center overflow-y-auto text-snow-100">
          {/* trending */}
          <div
            className={`w-full cursor-pointer rounded-sm pl-6 hover:bg-cyan-700 ${postMenu === "trending" && "bg-cyan-950"}`}
            onClick={() => {
              navigate("/blog");
            }}
          >
            Trending
          </div>
          {/* recent */}
          <div
            className={`mb-6 w-full cursor-pointer rounded-sm pl-6 hover:bg-cyan-700 ${postMenu === "recent" && "bg-cyan-950"}`}
            onClick={() => {
              navigate("/blog/recent");
            }}
          >
            Recent
          </div>
          {/* categories */}
          {categories.map((category, index) => {
            return (
              <div
                key={index}
                className={`w-full cursor-pointer rounded-sm pl-6 hover:bg-cyan-700 ${postMenu === category.toLowerCase() && "bg-cyan-950"}`}
                onClick={() => {
                  navigate(`/blog/${category.toLowerCase()}`);
                }}
              >
                {category}
              </div>
            );
          })}
        </div>
      </section>

      {/* posts section */}
      <section
        className={`flex w-[calc(100vw-144px)] flex-col bg-[#09131d] px-4 pt-1 md:w-[calc(100vw-192px)] lm:w-[calc(100vw-(192px+224px))] 
        ${postMenu === "trending" || postMenu === "recent" ? "ct-blogSection-bg-1" : "ct-blogSection-bg-2"}`}
      >
        {/* story section */}
        <section className="mb-5 mt-1 flex w-full">
          {/* create story */}
          {userStory !== undefined ? (
            <div className="flex flex-col items-center gap-y-2 text-white">
              {user && user.imageUrl ? (
                <button type="button" disabled={storyLoading} onClick={() => setViewStory(true)}>
                  <img
                    alt="Loading.."
                    src={user.imageUrl}
                    className="size-12 cursor-pointer object-cover rounded-full border-[2px] border-whitesmoke bg-slate-900"
                  />
                </button>
              ) : (
                <button type="button" disabled={storyLoading} onClick={() => setViewStory(true)}>
                  <RxAvatar
                    onClick={() => setViewStory(true)}
                    className="size-12 cursor-pointer rounded-full border-[2px] border-dotted border-whitesmoke bg-slate-900"
                  />
                </button>
              )}
              <div className="mb-2 text-center text-[0.7rem]">Your Story</div>
            </div>
          ) : (
            <div className="flex flex-shrink-0 flex-col items-center gap-y-2 text-white">
              <button type="button" disabled={storyLoading} onClick={() => setCreateStory(true)}>
                <div
                  className="flex size-12 cursor-pointer items-center justify-center rounded-full border-[2px] border-dotted 
                border-whitesmoke bg-slate-900"
                >
                  <GoPlus className="fill-white" />
                </div>
              </button>
              <div className="text-[0.6rem]">Add Story</div>
            </div>
          )}
          {/* following user stories */}
          <Stories />
        </section>
        {/* feeds section */}
        {/* height for below outlet after calculation can be 172.8px, for safety using 180px */}
        <div className="h-[calc(100vh-180px)] w-full">
          <Outlet />
        </div>
      </section>

      {/* create post and friend suggestion */}
      <section
        ref={sideSectionRef}
        className={` ${
          sideMenu === true ? "absolute bottom-0 right-0 top-0 z-40 flex flex-col" : "hidden lm:flex lm:flex-col"
        } w-56 gap-y-4 overflow-y-auto bg-[#030609] px-1 [box-shadow:-63px_0px_132px_12px_rgba(0,0,0,0.75)]`}
      >
        <div
          onClick={() => setCreatePost(true)}
          className="group relative mx-auto mt-4 flex h-12 w-10/12 cursor-pointer items-center justify-center overflow-hidden 
          rounded-md bg-sky-800 p-2 text-sky-50 duration-500 hover:border-sky-600"
        >
          <div
            className="absolute z-10 h-48 w-48 rounded-full bg-sky-900 transition-all delay-150 duration-500 ease-in-out 
            group-hover:scale-150 group-hover:delay-75"
          ></div>
          <div
            className="absolute z-10 h-40 w-40 rounded-full bg-sky-800 transition-all delay-150 duration-500 ease-in-out 
            group-hover:scale-150 group-hover:delay-100"
          ></div>
          <div
            className="absolute z-10 h-32 w-32 rounded-full bg-sky-700 transition-all delay-150 duration-500 ease-in-out 
            group-hover:scale-150 group-hover:delay-150"
          ></div>
          <div
            className="absolute z-10 h-24 w-24 rounded-full bg-sky-600 transition-all delay-150 duration-500 ease-in-out 
            group-hover:scale-150 group-hover:delay-200"
          ></div>
          <div
            className="absolute z-10 h-16 w-16 rounded-full bg-sky-500 transition-all delay-150 duration-500 ease-in-out 
            group-hover:scale-150 group-hover:delay-300"
          ></div>
          <p className="z-10 font-semibold text-white">Create Post</p>
        </div>
        {/* follow suggestions */}
        <div className="mx-auto w-10/12 border-[1px] border-dashed border-snow-500"></div>

        <div onClick={() => setIsSearchOpen(true)}>
          <TalkVerseButton className="mx-auto h-7 w-9/12" />
        </div>
        {/* all suggestions and requests */}
        <div className="flex w-full flex-col gap-y-4">
          <div className="ml-2 mt-2 font-be-veitnam-pro text-stone-100">Suggestions</div>
          <div className="flex flex-col gap-y-2 text-snow-50">
            {suggestions.length ? (
              suggestions.map((suggestion, index) => {
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-x-1">
                      {suggestion.imageUrl ? (
                        <img alt="Loading..." src={suggestion.imageUrl} className="size-10 rounded-full" />
                      ) : (
                        <RxAvatar className="size-10 rounded-full" />
                      )}
                      <div className="ml-1 flex flex-col">
                        <p className="text-[0.9rem]">{suggestion.firstName + " " + suggestion.lastName}</p>
                        <p className="text-[0.7rem] text-neutral-500">{suggestion.userName}</p>
                      </div>
                    </div>
                    <button
                      disabled={sendingReq.includes(suggestion.id)}
                      onClick={() => sendFollowRequest(suggestion.id)}
                    >
                      <HiOutlineUserAdd className="mr-[0.4rem] size-6 cursor-pointer hover:fill-white" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="mx-auto text-xs">No more Suggestions</div>
            )}
          </div>
          {/* follow requests */}
          <div className="mx-auto w-10/12 border-[1px] border-dashed border-snow-500"></div>
          <div className="ml-2 mt-2 font-be-veitnam-pro text-stone-100">Follow Requests</div>
          <div className="flex flex-col gap-y-2 text-snow-50">
            {followRequests.length ? (
              followRequests.map((followRequest, index) => {
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-x-1">
                      {followRequest.imageUrl ? (
                        <img alt="Loading..." src={followRequest.imageUrl} className="size-10 rounded-full" />
                      ) : (
                        <RxAvatar className="size-10 rounded-full" />
                      )}
                      <div className="ml-1 flex flex-col">
                        <p className="text-[0.9rem]">{followRequest.firstName + " " + followRequest.lastName}</p>
                        <p className="text-[0.7rem] text-neutral-500">{followRequest.userName}</p>
                      </div>
                    </div>
                    <div className="mr-[0.4rem] flex gap-x-1">
                      <button
                        disabled={answeringReq.includes(followRequest.id)}
                        onClick={() => acceptRequest(followRequest.id)}
                      >
                        <CiCirclePlus
                          className="aspect-auto size-6 cursor-pointer rounded-full text-white hover:bg-white 
                        hover:text-black"
                        />
                      </button>
                      <button
                        disabled={answeringReq.includes(followRequest.id)}
                        onClick={() => deleteRequest(followRequest.id)}
                      >
                        <CiCirclePlus
                          className="aspect-auto size-6 rotate-45 cursor-pointer rounded-full text-white hover:bg-white 
                        hover:text-black"
                        />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="mx-auto text-xs">No follow Requests</div>
            )}
          </div>
        </div>
      </section>

      {createPost && <CreatePost setCreatePost={setCreatePost} />}
      {createStory && (
        <CreateStory setCreateStory={setCreateStory} setUserStory={setUserStory} setStoryLoading={setStoryLoading} />
      )}
      {isSearchOpen && (
        <SearchModal setIsSearchOpen={setIsSearchOpen} requestType="follow" sendFollowRequest={sendFollowRequest} />
      )}

      {/* view following user story */}
      {viewStory && (
        <section className="fixed inset-0 top-16 z-50 flex max-w-maxContent items-center justify-center overflow-y-auto backdrop-blur-[20px]">
          <div className="absolute z-50 flex h-[28rem] w-72 items-center justify-center bg-neutral-950">
            <button
              onClick={() => deleteStory()}
              className="absolute -bottom-16 w-fit rounded-lg bg-snow-500 px-4 py-1 text-neutral-950"
            >
              Delete
            </button>
            <MdOutlineCancelPresentation
              onClick={() => setViewStory(false)}
              className="absolute -right-16 -top-14 h-8 w-11 cursor-pointer fill-black hover:fill-slate-300 lm:-right-28"
            />
            {userStory &&
              (userStory.storyUrl.includes("image/") ? (
                <img alt="Loading..." src={userStory.storyUrl} />
              ) : (
                <video src={userStory.storyUrl} />
              ))}
          </div>

          {/* canvas effect */}
          <AnimatePresence>
            <div className="absolute inset-0 h-full w-full">
              <CanvasReveal animationSpeed={10} containerClassName="bg-sky-600" colors={[[125, 211, 252]]} />
            </div>
          </AnimatePresence>
        </section>
      )}
    </div>
  );
};

export default Blog;
