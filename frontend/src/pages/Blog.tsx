import { useAppSelector } from "@/redux/store";
import { RxAvatar } from "react-icons/rx";
import { Outlet } from "react-router-dom";

const Blog = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent bg-neutral-950">
      {/* user profile and category section  */}
      <section className=" w-40 lg:w-48  bg-white">
        {/* user profile details */}
        <div className=" flex flex-col mt-8 text-snow-200 font-be-veitnam-pro items-center gap-y-6">
          {user?.imageUrl ? (
            <img
              src={user?.imageUrl}
              alt="Loading..."
              className=" size-24 rounded-full aspect-auto"
            />
          ) : (
            <RxAvatar className=" w-full size-24 rounded-full aspect-auto fill-slate-500" />
          )}
          {user && <p>{user?.firstName + user?.lastName}</p>}
          {user && <p>{user.userName}</p>}
        </div>
      </section>
      {/* posts section */}
      <section className=" w-32 flex-1 ">
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
