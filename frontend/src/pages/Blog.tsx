import { useAppSelector } from "@/redux/store";
import { userBlogProfileApi } from "@/services/operations/profileApi";
import { BlogProfile } from "@/types/apis/profileApiRs";
import { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogProfile = async () => {
      const response = await userBlogProfileApi();
      if (response) {
        setBlogProfile(response.blogProfile);
      } else {
        toast.error("Error while getting blogProfie data");
        navigate("/error");
      }
    };
    getBlogProfile();
  }, []);

  useEffect(() => {
    const title = location.pathname.split("/").pop();
    setPostMenu(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent bg-neutral-950">
      {/* user profile and category section  */}
      <section className="w-48 h-full flex flex-col pl-3">
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
          <div className=" border-dashed border-[1px] border-snow-500 w-full mt-2"></div>
        </div>
        {/* posts categories */}
        <div className=" flex flex-col text-snow-100 items-center my-8 overflow-y-scroll">
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
      <section className="flex-1 ">
        {/* story section */}
        <section></section>
        <Outlet />
      </section>
      {/* create post and friend suggestion */}
      <section className="hidden lm:flex lm:flex-col gap-y-4 lm:w-40 lg:w-48">
        <div className="relative h-12 w-10/12 mt-4 mx-auto p-2 flex justify-center items-center hover:border-sky-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden rounded-md bg-sky-800">
          <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
          <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
          <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
          <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
          <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
          <p className="z-10 text-white font-semibold">Create Post</p>
        </div>
        <div className=" text-stone-100">Suggestions</div>
        <div className=" flex flex-col text-snow-50">
          <div>user</div>
        </div>
        <div className=" border-dashed border-[1px] border-snow-500 w-full mt-2"></div>
      </section>
    </div>
  );
};

export default Blog;
