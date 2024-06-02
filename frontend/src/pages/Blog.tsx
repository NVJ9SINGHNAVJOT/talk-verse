import { Outlet } from "react-router-dom";

const Blog = () => {
  return (
    <div className="w-full flex h-[calc(100vh-4rem)] min-w-minContent">
      {/* user profile and category section  */}
      <section className=" w-72 bg-black"></section>
      {/* posts section */}
      <section className=" w-full bg-yellow-200">
        {/* story section */}
        <section></section>
        <Outlet />
      </section>
      {/* create post and friend suggestion */}
      <section className=" w-72 bg-red-800"></section>
    </div>
  );
};

export default Blog;
