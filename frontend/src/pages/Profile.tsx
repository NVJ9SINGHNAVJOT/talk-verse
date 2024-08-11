import ReviewModal from "@/components/core/profile/ReviewModal";
import { loadingSliceObject, setProfilePageLoading } from "@/redux/slices/loadingSlice";
import { setProfile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { getProfileApi } from "@/services/operations/profileApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const proifleMenu = ["Profile", "MyPosts", "Following", "Followers", "Saved", "Settings", "Review"];

const Profile = () => {
  const profilePageLd = useAppSelector((state) => state.loading.profilePageLd);
  const [title, setTitle] = useState<string>();
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goMenu = (menu: string) => {
    if (menu === "Review") {
      setOpenReviewModal(true);
    } else if (menu === "Profile") {
      navigate("/profile");
    } else {
      navigate(`/profile/${menu.toLowerCase()}`);
    }
  };

  useEffect(() => {
    (async () => {
      if (loadingSliceObject.apiCalls["profile"] === true) {
        return;
      }

      loadingSliceObject.apiCalls["profile"] = true;
      const response = await getProfileApi();

      if (response && response.success === true) {
        dispatch(setProfile(response.userData));
        dispatch(setProfilePageLoading(false));
      } else {
        loadingSliceObject.apiCalls["profile"] = false;
        toast.error("Error while getting profile data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    const newTitle = pathname.split("/");
    setTitle(newTitle[newTitle.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full min-w-minContent max-w-maxContent">
      {/* left bar profile menu section*/}
      <section
        className="h-full w-[8rem] overflow-y-auto bg-[#A69F96] transition-all 
        ease-in-out hover:bg-[#FBF4D0] md:w-[11rem] lg:w-[14rem]"
      >
        <div className="group mt-28 flex w-full flex-col gap-5">
          {proifleMenu.map((menu, index) => {
            return (
              <div
                key={index}
                className={`font-roboto-condensed text-xl text-richblack-800 ${
                  title === menu.toLowerCase() && "bg-[#FBF4D0] group-hover:bg-[#A69F96]"
                } w-full cursor-pointer px-4 py-1 lm:px-10 lm:py-3`}
                onClick={() => goMenu(menu)}
              >
                {menu}
              </div>
            );
          })}
        </div>
      </section>

      {/* right bar chat main section */}
      <section
        className="ct-userInfoBack min-h-full w-[calc(100vw-8rem)] overflow-y-auto md:w-[calc(100vw-11rem)] 
        lg:w-[calc(100vw-14rem)]"
      >
        {profilePageLd === true ? (
          <div
            className="flex h-full w-full animate-pulse items-center justify-center font-be-veitnam-pro 
            text-4xl font-semibold text-black"
          >
            <div>Loading...</div>
          </div>
        ) : (
          <Outlet />
        )}
      </section>

      {openReviewModal && <ReviewModal setOpenReviewModal={setOpenReviewModal} />}
    </div>
  );
};

export default Profile;
