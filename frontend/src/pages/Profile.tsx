import ReviewModal from "@/components/core/profile/ReviewModal";
import { setApiCall } from "@/redux/slices/loadingSlice";
import { setProfile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { getProfileApi } from "@/services/operations/profileApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const proifleMenu = ["Profile", "MyPosts", "Following", "Followers", "Saved", "Settings", "Review"];

const Profile = () => {
  const apiCalls = useAppSelector((state) => state.loading.apiCalls);
  const [loading, setLoading] = useState<boolean>(true);
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
    const getProfile = async () => {
      if (apiCalls["getProfileApi"] === true) {
        return;
      }
      /* NOTE: getProfileApi api call state management */
      dispatch(setApiCall({ api: "getProfileApi", status: true }));
      const response = await getProfileApi();
      if (response && response.success === true) {
        dispatch(setProfile(response.userData));
        setLoading(false);
      } else {
        toast.error("Error while getting profile data");
        navigate("/error");
      }
      dispatch(setApiCall({ api: "getProfileApi", status: false }));
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
      {/* left bar profile menu section*/}
      <section
        className=" w-[8rem] md:w-[11rem] lg:w-[14rem] h-full bg-[#A69F96] max-w-maxContent
       hover:bg-[#FBF4D0] transition-all ease-in-out overflow-y-auto "
      >
        <div className=" group flex flex-col w-full mt-28 gap-5">
          {proifleMenu.map((menu, index) => {
            return (
              <div
                key={index}
                className={`font-roboto-condensed text-richblack-800 text-xl ${
                  title === menu.toLowerCase() && "bg-[#FBF4D0] group-hover:bg-[#A69F96]"
                } cursor-pointer w-full px-4 py-1 lm:px-10 lm:py-3`}
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
          className=" w-[calc(100vw-8rem)] md:w-[calc(100vw-11rem)] lg:w-[calc(100vw-14rem)] max-w-maxContent overflow-y-auto 
        ct-userInfoBack min-h-full blur-md"
        ></div>
      ) : (
        <section
          className=" w-[calc(100vw-8rem)] md:w-[calc(100vw-11rem)] lg:w-[calc(100vw-14rem)] max-w-maxContent overflow-y-auto 
      ct-userInfoBack min-h-full"
        >
          <Outlet />
        </section>
      )}

      {openReviewModal && <ReviewModal setOpenReviewModal={setOpenReviewModal} />}
    </div>
  );
};

export default Profile;
