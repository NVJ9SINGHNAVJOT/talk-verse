import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="w-full flex h-[calc(100vh-4rem)]">
      {/* left bar chat list section*/}
      <section className="sm:w-5/12 md:w-4/12 lg:w-3/12 h-full bg-[#A69F96]">
        
      </section>

      {/* right bar chat main section */}
      <section className="sm:w-7/12 md:w-8/12 lg:w-9/12 overflow-y-auto">
        <Outlet />
      </section>
    </div>
  );
};

export default Profile;
