import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="w-full flex bg-grayblack h-[calc(100vh-4rem)]">
      {/* left bar chat list section*/}
      <section className="sm:w-5/12 md:w-4/12 lg:w-3/12 h-full bg-teal-950">
        
      </section>

      {/* right bar chat main section */}
      <section className="sm:w-7/12 md:w-8/12 lg:w-9/12 h-full">
        <Outlet />
      </section>
    </div>
  );
};

export default Profile;
