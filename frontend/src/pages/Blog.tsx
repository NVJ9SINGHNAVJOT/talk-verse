import { useAppSelector } from "@/redux/store";
import { userBlogProfileApi } from "@/services/operations/postApi";
import { BlogProfile } from "@/types/apis/postApiRs";
import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Blog = () => {
  const user = useAppSelector((state) => state.user.user);
  const [blogProfile, setBlogProfile] = useState<BlogProfile>();
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

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent bg-neutral-950">
      {/* user profile and category section  */}
      <section className="w-48 h-full overflow-y-scroll pl-3">
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
              <p className="text-xs leading-3">Posts</p>
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
        </div>
        {/* posts categories */}
        <div></div>
      </section>
      {/* posts section */}
      <section className="flex-1 ">
        {/* story section */}
        <section></section>
        <Outlet />
      </section>
      {/* create post and friend suggestion */}
      <section className="hidden lm:block lm:w-40 lg:w-48"></section>
    </div>
  );
};

export default Blog;
