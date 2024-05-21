import { removeApiCall, setApiCall } from "@/redux/slices/loadingSlice";
import { setProfile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { getProfileApi } from "@/services/operations/profileApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const proifleMenu = ["Profile", "Dashboard", "Settings"];

const Profile = () => {
  const apiCalls = useAppSelector((state) => state.loading.apiCalls);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>();
  const navigate = useNavigate();
  const dispacth = useDispatch();
  const goMenu = (menu: string) => {
    if (menu === "Profile") {
      navigate("/profile");
    } else {
      navigate(`/profile/${menu.toLowerCase()}`);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      if (apiCalls["getProfileApi"] === true) {
        return;
      }
      /* ===== Caution: getProfileApi api call state management ===== */
      dispacth(setApiCall("getProfileApi"));
      const response = await getProfileApi();
      dispacth(removeApiCall("getProfileApi"));
      if (response && response.success === true) {
        dispacth(setProfile(response.userData));
        setLoading(false);
      } else {
        toast.error("Error while getting profile data");
        navigate("/error");
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    const newTitle = pathname.split("/");
    setTitle(newTitle[newTitle.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="w-full flex h-[calc(100vh-4rem)]">
      {/* left bar chat list section*/}
      <section
        className=" w-[9rem] md:w-[11rem] lg:w-[14rem] h-full bg-[#A69F96] max-w-maxContent
       hover:bg-[#FBF4D0] transition-all ease-in-out"
      >
        <div className=" group flex flex-col w-full mt-28 gap-5">
          {proifleMenu.map((menu, index) => {
            return (
              <div
                key={index}
                className={`font-roboto-condensed text-richblack-800 text-xl ${
                  title === menu.toLowerCase() &&
                  "bg-[#FBF4D0] group-hover:bg-[#A69F96]"
                } cursor-pointer w-full sm:px-4 sm:py-1 lm:px-10 lm:py-3`}
                onClick={() => goMenu(menu)}
              >
                {menu}
              </div>
            );
          })}
        </div>
      </section>

      {/* right bar chat main section */}
      {loading ? (
        <div
          className=" w-[calc(100vw-9rem)] md:w-[calc(100vw-11rem)] lg:w-[calc(100vw-14rem)] max-w-maxContent overflow-y-auto 
        ct-userInfoBack min-h-full blur-md"
        ></div>
      ) : (
        <section
          className=" w-[calc(100vw-9rem)] md:w-[calc(100vw-11rem)] lg:w-[calc(100vw-14rem)] max-w-maxContent overflow-y-auto 
      ct-userInfoBack min-h-full"
        >
          <Outlet />
        </section>
      )}
    </div>
  );
};

export default Profile;