import CreatePost from "@/components/core/blog/post/CreatePost";
import CreateStory from "@/components/core/blog/story/CreateStory";
import Stories from "@/components/core/blog/story/Stories";
import { setTotalPosts } from "@/redux/slices/postSlice";
import { useAppSelector } from "@/redux/store";
import {
  acceptFollowRequestApi,
  deletFollowRequestApi,
  followRequestsApi,
  followSuggestionsApi,
  sendFollowRequestApi,
} from "@/services/operations/notificationApi";
import { userStoryApi } from "@/services/operations/postApi";
import { userBlogProfileApi } from "@/services/operations/profileApi";
import { UserSuggestion } from "@/types/apis/notificationApiRs";
import { UserStory } from "@/types/apis/postApiRs";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { HiOutlineUserAdd } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categories = [
  "Technology",
  "Lifestyle",
  "Blog",
  "Nature",
  "Music",
  "Sports",
  "Health",
  "Finance",
  "Art",
  "History",
  "Literature",
  "Science",
  "Business",
  "Other",
];

const Blog = () => {
  const user = useAppSelector((state) => state.user.user);
  const userPosts = useAppSelector((state) => state.post.userTotalPosts);
  const [following, setFollowing] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [postMenu, setPostMenu] = useState<string>();
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [followRequests, setFollowRequests] = useState<UserSuggestion[]>([]);
  const [sendingReq, setSendingReq] = useState<boolean>(false);
  const [acceptingReq, setAcceptingReq] = useState<boolean>(false);
  const [deletingReq, setDeletingReq] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [createStory, setCreateStory] = useState<boolean>(false);
  const [userStory, setUserStory] = useState<UserStory>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendFollowRequest = async (reqUserId: number) => {
    setSendingReq(true);
    const response = await sendFollowRequestApi(reqUserId);
    if (response) {
      setSuggestions((prev) => prev.filter((user) => user.id !== reqUserId));
      toast.success("Request send to follow");
    } else {
      toast.error("Error while sending request");
    }
    setSendingReq(false);
  };

  const acceptRequest = async (reqUserId: number) => {
    setAcceptingReq(true);
    const response = await acceptFollowRequestApi(reqUserId);
    if (response) {
      setFollowRequests((prev) => prev.filter((user) => user.id != reqUserId));
      setFollowers((prev) => prev + 1);
      toast.success("New follower added");
    } else {
      toast.error("Error while adding follower");
    }
    setAcceptingReq(false);
  };

  const deleteRequest = async (reqUserId: number) => {
    setDeletingReq(true);
    const response = await deletFollowRequestApi(reqUserId);
    if (response) {
      setFollowRequests((prev) => prev.filter((user) => user.id != reqUserId));
    } else {
      toast.error("Error while adding follower");
    }
    setDeletingReq(false);
  };

  const getSuggestions = async () => {
    const response = await followSuggestionsApi();
    if (response) {
      if (response.suggestions?.length) {
        setSuggestions(response.suggestions);
      }
    } else {
      toast.error("Error while getting followSuggestions");
      navigate("/error");
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
      navigate("/error");
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
    setPostMenu(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="relative w-full flex h-[calc(100vh-4rem)] min-w-minContent">
      {/* user profile and category section  */}
      <section className="w-36 md:w-48 h-full flex flex-col px-1 bg-[#030609]">
        {/* user profile details */}
        <div className="flex flex-col mt-4 text-snow-200 font-be-veitnam-pro items-center gap-y-1">
          {user?.imageUrl ? (
            <img src={user?.imageUrl} alt="Loading..." className=" size-20 rounded-full aspect-auto" />
          ) : (
            <RxAvatar className="w-full size-20 rounded-full aspect-auto fill-slate-500" />
          )}
          {user && <p className=" text-[1rem]">{user?.firstName + " " + user?.lastName}</p>}
          {user && <p className=" text-[0.8rem]">{user.userName}</p>}
          <div className=" w-full flex flex-col md:flex-row mt-2 gap-y-2 md:gap-y-0 md:mt-5 md:justify-between">
            <div className="flex flex-col items-center md:ml-1">
              <p className="leading-4">{userPosts}</p>
              <p className="text-xs leading-3">Post</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="leading-4">{followers}</p>
              <p className="text-xs leading-3">Followers</p>
            </div>
            <div className="flex flex-col items-center md:mr-1">
              <p className="leading-4">{following}</p>
              <p className="text-xs leading-3">Following</p>
            </div>
          </div>
          <div className=" border-dashed border-[1px] border-snow-500 w-10/12 mt-2"></div>
        </div>
        {/* posts categories */}
        <div className=" flex flex-col text-snow-100 items-center my-6 overflow-y-auto">
          <div
            className={`w-full pl-6 rounded-sm cursor-pointer hover:bg-cyan-700
              ${postMenu === "trending" && "bg-cyan-950"}`}
            onClick={() => {
              navigate("/blog/trending");
            }}
          >
            Trending
          </div>
          <div
            className={`w-full pl-6 rounded-sm cursor-pointer hover:bg-cyan-700 mb-6
            ${postMenu === "recent" && "bg-cyan-950"}`}
            onClick={() => {
              navigate("/blog/recent");
            }}
          >
            Recent
          </div>
          {categories.map((category, index) => {
            return (
              <div
                key={index}
                className={`w-full pl-6 rounded-sm cursor-pointer hover:bg-cyan-700
                  ${postMenu === category.toLowerCase() && "bg-cyan-950"}`}
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
      <section className=" w-[calc(100vw-144px)] md:w-[calc(100vw-192px)] lm:w-[calc(100vw-(192px+224px))] flex flex-col bg-[#09131d] pt-1 px-4">
        {/* story section */}
        <section className="w-full flex mt-1 mb-5">
          {/* create story */}
          {userStory !== undefined ? (
            <div className="flex flex-col items-center gap-y-2 text-white">
              {user && user.imageUrl ? (
                <img
                  alt="Loading.."
                  src={user.imageUrl}
                  className=" bg-slate-900 cursor-pointer rounded-full size-12 border-[2px]
                  border-dotted border-whitesmoke"
                />
              ) : (
                <RxAvatar />
              )}

              <div className=" text-[0.7rem] text-center mb-2">Add Story</div>
            </div>
          ) : (
            <div className="flex flex-col items-center flex-shrink-0 gap-y-2 text-white">
              <div
                onClick={() => setCreateStory(true)}
                className=" bg-slate-900 cursor-pointer flex justify-center items-center rounded-full size-12 border-[2px]
                border-dotted border-whitesmoke"
              >
                <GoPlus className=" fill-white" />
              </div>
              <div className=" text-[0.6rem]">Add Story</div>
            </div>
          )}
          {/* following user stories */}
          <Stories />
        </section>
        {/* feeds section */}
        {/* height for below outlet after calculation can be 172.8px, for safety using 180px */}
        <div className=" w-full h-[calc(100vh-180px)]">
          <Outlet />
        </div>
      </section>

      {/* create post and friend suggestion */}
      <section className="hidden lm:flex lm:flex-col gap-y-4 w-56 px-1 bg-[#030609]">
        <div
          onClick={() => setCreatePost(true)}
          className="relative h-12 w-10/12 mt-4 mx-auto p-2 flex justify-center items-center hover:border-sky-600 duration-500 
          group cursor-pointer text-sky-50 overflow-hidden rounded-md bg-sky-800"
        >
          <div
            className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all
           duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"
          ></div>
          <div
            className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all
           duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"
          ></div>
          <div
            className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all
           duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"
          ></div>
          <div
            className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all
           duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"
          ></div>
          <div
            className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all
           duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"
          ></div>
          <p className="z-10 text-white font-semibold">Create Post</p>
        </div>
        {/* follow suggestions */}
        <div className=" border-dashed border-[1px] border-snow-500 w-10/12 mx-auto"></div>
        {/* all suggestions and requests */}
        <div className="w-full flex flex-col gap-y-4 overflow-y-auto">
          <div className=" text-stone-100 mt-2 ml-2 font-be-veitnam-pro">Suggestions</div>
          <div className=" flex flex-col text-snow-50 gap-y-2">
            {suggestions.length ? (
              suggestions.map((suggestion, index) => {
                return (
                  <div key={index} className=" flex justify-between items-center">
                    <div className="flex items-center gap-x-1">
                      {suggestion.imageUrl ? (
                        <img alt="Loading..." src={suggestion.imageUrl} className=" size-10 rounded-full" />
                      ) : (
                        <RxAvatar className=" size-10 rounded-full" />
                      )}
                      <div className=" flex flex-col ml-1">
                        <p className="text-[0.9rem]">{suggestion.firstName + " " + suggestion.lastName}</p>
                        <p className=" text-neutral-500 text-[0.7rem]">{suggestion.userName}</p>
                      </div>
                    </div>
                    <button disabled={sendingReq} onClick={() => sendFollowRequest(suggestion.id)}>
                      <HiOutlineUserAdd className="size-6 hover:fill-white cursor-pointer mr-[0.4rem]" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-xs mx-auto">No more Suggestions</div>
            )}
          </div>
          {/* follow requests */}
          <div className=" border-dashed border-[1px] border-snow-500 w-10/12 mx-auto"></div>
          <div className=" text-stone-100 mt-2 ml-2 font-be-veitnam-pro">Follow Requests</div>
          <div className=" flex flex-col text-snow-50 gap-y-2">
            {followRequests.length ? (
              followRequests.map((followRequest, index) => {
                return (
                  <div key={index} className=" flex justify-between items-center">
                    <div className="flex items-center gap-x-1">
                      {followRequest.imageUrl ? (
                        <img alt="Loading..." src={followRequest.imageUrl} className="size-10 rounded-full" />
                      ) : (
                        <RxAvatar className="size-10 rounded-full" />
                      )}
                      <div className=" flex flex-col ml-1">
                        <p className="text-[0.9rem]">{followRequest.firstName + " " + followRequest.lastName}</p>
                        <p className=" text-neutral-500 text-[0.7rem]">{followRequest.userName}</p>
                      </div>
                    </div>
                    <div className="flex gap-x-1 mr-[0.4rem]">
                      <button disabled={acceptingReq} onClick={() => acceptRequest(followRequest.id)}>
                        <CiCirclePlus className=" text-white size-6 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full" />
                      </button>
                      <button disabled={deletingReq} onClick={() => deleteRequest(followRequest.id)}>
                        <CiCirclePlus className=" text-white size-6 aspect-auto cursor-pointer rotate-45 hover:bg-white hover:text-black rounded-full" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs mx-auto">No follow Requests</div>
            )}
          </div>
        </div>
      </section>

      {createPost && <CreatePost setCreatePost={setCreatePost} />}
      {createStory && <CreateStory setCreateStory={setCreateStory} setUserStory={setUserStory} />}
    </div>
  );
};

export default Blog;
