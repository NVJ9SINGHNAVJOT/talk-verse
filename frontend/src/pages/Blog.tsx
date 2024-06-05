import { useAppSelector } from "@/redux/store";
import { RxAvatar } from "react-icons/rx";
import { Outlet } from "react-router-dom";

const Blog = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent bg-neutral-950">
      {/* user profile and category section  */}
      <section className=" w-48 h-full overflow-y-scroll pl-3">
        {/* user profile details */}
        <div className=" flex flex-col mt-4 text-snow-200 font-be-veitnam-pro items-center gap-y-1">
          {user?.imageUrl ? (
            <img
              src={user?.imageUrl}
              alt="Loading..."
              className=" size-20 rounded-full aspect-auto"
            />
          ) : (
            <RxAvatar className=" w-full size-20 rounded-full aspect-auto fill-slate-500" />
          )}
          {user && <p className=" text-[1rem]">{user?.firstName + " " + user?.lastName}</p>}
          {user && <p className=" text-[0.8rem]">{user.userName}</p>}
          <div className=" w-full flex mt-5 justify-between">
            <div className=" flex flex-col items-center ml-1">
              <p>50</p>
              <p className=" text-xs">Posts</p>
            </div>
            <div className=" flex flex-col items-center">
              <p>50</p>
              <p className=" text-xs">Followers</p>
            </div>
            <div className=" flex flex-col items-center mr-1">
              <p>50</p>
              <p className=" text-xs">Following</p>
            </div>
          </div>
        </div>
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
