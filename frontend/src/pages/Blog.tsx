import { useAppSelector } from "@/redux/store";
import { followRequestsApi, followSuggestionsApi, sendFollowRequestApi } from "@/services/operations/notificationApi";
import { userBlogProfileApi } from "@/services/operations/profileApi";
import { UserSuggestion } from "@/types/apis/notificationApiRs";
import { BlogProfile } from "@/types/apis/profileApiRs";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { HiOutlineUserAdd } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
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
  const [blogProfile, setBlogProfile] = useState<BlogProfile>();
  const [postMenu, setPostMenu] = useState<string>();
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [followRequests, setFollowRequests] = useState<UserSuggestion[]>([]);
  const [sendingReq, setSendingReq] = useState<boolean>(false);
  const navigate = useNavigate();

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
      setBlogProfile(response.blogProfile);
    } else {
      toast.error("Error while getting blogProfie data");
      navigate("/error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getSuggestions(), getFollowRequests(), getBlogProfile()]);
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
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent">
      {/* user profile and category section  */}
      <section className="w-48 h-full flex flex-col px-1 bg-[#030609]">
        {/* user profile details */}
        <div className="flex flex-col mt-4 text-snow-200 font-be-veitnam-pro items-center gap-y-1">
          {user?.imageUrl ? (
            <img src={user?.imageUrl} alt="Loading..." className=" size-20 rounded-full aspect-auto" />
          ) : (
            <RxAvatar className="w-full size-20 rounded-full aspect-auto fill-slate-500" />
          )}
          {user && <p className=" text-[1rem]">{user?.firstName + " " + user?.lastName}</p>}
          {user && <p className=" text-[0.8rem]">{user.userName}</p>}
          <div className=" w-full flex mt-5 justify-between">
            <div className="flex flex-col items-center ml-1">
              <p className="leading-4">{blogProfile?.totalPosts}</p>
              <p className="text-xs leading-3">Post</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="leading-4">{blogProfile?.followersCount}</p>
              <p className="text-xs leading-3">Followers</p>
            </div>
            <div className="flex flex-col items-center mr-1">
              <p className="leading-4">{blogProfile?.followingCount}</p>
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
      <section className="flex-1 bg-[#09131d]">
        {/* story section */}
        <section>Story</section>
        <Outlet />
      </section>
      {/* create post and friend suggestion */}
      <section className="hidden lm:flex lm:flex-col gap-y-4 lm:w-48 lg:w-56 px-1 bg-[#030609]">
        <div className="relative h-12 w-10/12 mt-4 mx-auto p-2 flex justify-center items-center hover:border-sky-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden rounded-md bg-sky-800">
          <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
          <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
          <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
          <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
          <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
          <p className="z-10 text-white font-semibold">Create Post</p>
        </div>
        {/* follow requests */}
        <div className=" text-stone-100 mt-8">Follow Requests</div>
        <div className=" flex flex-col text-snow-50 gap-y-2">
          {followRequests.length ? (
            followRequests.map((followRequest, index) => {
              return (
                <div key={index} className=" flex justify-between items-center ">
                  <div className="flex items-center gap-x-1">
                    {followRequest.imageUrl ? (
                      <img alt="Loading..." src={followRequest.imageUrl} className=" size-10 rounded-full" />
                    ) : (
                      <RxAvatar className=" size-10 rounded-full" />
                    )}
                    <div className=" flex flex-col ml-1">
                      <p className="text-[0.9rem]">{followRequest.firstName + " " + followRequest.lastName}</p>
                      <p className=" text-neutral-500 text-[0.7rem]">{followRequest.userName}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <CiCirclePlus className=" text-white w-8 h-8 aspect-auto cursor-pointer hover:bg-white hover:text-black rounded-full" />
                    <CiCirclePlus className=" text-white w-8 h-8 aspect-auto cursor-pointer rotate-45 hover:bg-white hover:text-black rounded-full" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs mx-auto">No follow Requests</div>
          )}
        </div>
        <div className=" border-dashed border-[1px] border-snow-500 w-10/12 mx-auto mt-2"></div>
        {/* follow suggestions */}
        <div className=" text-stone-100 mt-8">Suggestions</div>
        <div className=" flex flex-col text-snow-50 gap-y-2">
          {suggestions.length ? (
            suggestions.map((suggestion, index) => {
              return (
                <div key={index} className=" flex justify-between items-center ">
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
                    <HiOutlineUserAdd className="size-6 hover:fill-white cursor-pointer" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-xs mx-auto">No more Suggestions</div>
          )}
        </div>
        <div className=" border-dashed border-[1px] border-snow-500 w-10/12 mx-auto mt-2"></div>
      </section>
    </div>
  );
};

export default Blog;
