import { useLocation, useNavigate } from "react-router-dom";
import mainLogo from "@/assets/images/mainLogo.png";
import SignInButton from "@/lib/buttons/signinbutton/SignInButton";
import { useAppSelector } from "@/redux/store";
import UserMenu from "@/components/common/UserMenu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { checkUserApi } from "@/services/operations/authApi";
import { CheckUserApi } from "@/types/apis/authApiRs";
import { setUser, User } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/slices/authSlice";
import SiteLoadingModal from "./SiteLoadingModal";

const MainNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user.user);
  const authUser = useAppSelector((state) => state.auth.authUser);
  const [checkUser, setCheckUser] = useState<boolean>(true);
  const [menu, setMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRefExclude = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setMenu(false), menuRefExclude);

  const toogleMenu = () => {
    setMenu((prev) => !prev);
  };

  const homeHandler = () => {
    navigate("/");
  };

  const aboutHandler = () => {
    navigate("/about");
  };

  const talkHandler = () => {
    if (authUser) {
      navigate("/talk");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const checkDefaultLogin = async () => {
      const response: CheckUserApi = await checkUserApi();

      if (
        response &&
        response.success === true &&
        response.firstName &&
        response.lastName
      ) {
        const user: User = {
          firstName: response.firstName,
          lastName: response.lastName,
          imageUrl: response.imageUrl ? response.imageUrl : "",
        };
        dispatch(setUser(user));
        dispatch(setAuthUser(true));
        navigate(location.pathname);
        setCheckUser(false);
      } else {
        setCheckUser(false);
      }
    };
    checkDefaultLogin();
  }, []);

  return (
    <div
      className="relative bg-[radial-gradient(circle_at_24.1%_68.8%,_rgb(50,_50,_50)_0%,_rgb(0,_0,_0)_99.4%)]
      h-[4rem] flex justify-between items-center w-full"
    >
      {/* main logo and name */}
      <div className="flex items-center justify-evenly gap-5 ml-8">
        <img
          alt="Logo"
          src={mainLogo}
          className="h-14 cursor-pointer"
          onClick={homeHandler}
        />
        <div
          className="ct-mainLogoButton text-2xl font-semibold  text-richblack-25 "
          role="button"
          onClick={homeHandler}
        >
          TalkVerse
        </div>
      </div>

      {/* navbar menu */}
      <div className="hidden md:flex justify-evenly items-center md:gap-2 lg:gap-5">
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={homeHandler}
        >
          Home
        </div>
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={aboutHandler}
        >
          About
        </div>
        <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Contact
        </div>
        <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Dashboard
        </div>
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={talkHandler}
        >
          Talk
        </div>
        <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Blog
        </div>
      </div>

      {/* sign in buttons or user logo */}
      {user ? (
        <div
          className={`${
            checkUser ? "opacity-0" : "opacity-100"
          } sm:flex justify-evenly items-center md:gap-2 sm:gap-x-2 mr-8 `}
        >
          <UserMenu />
          <div ref={menuRefExclude} onClick={toogleMenu} className="md:hidden">
            <GiHamburgerMenu className="cursor-pointer w-6 h-8 ml-2 aspect-auto text-white rounded-sm" />
          </div>
        </div>
      ) : (
        <div
          className={`${
            checkUser ? "opacity-0" : "opacity-100"
          } flex justify-evenly items-center sm:gap-3 lg:gap-5 mr-8`}
        >
          <SignInButton title={"Log In"} />
          <SignInButton title={"Sign Up"} />

          <div ref={menuRefExclude} onClick={toogleMenu} className=" md:hidden">
            <GiHamburgerMenu className="cursor-pointer w-6 h-8 ml-2 aspect-auto text-white rounded-sm" />
          </div>
        </div>
      )}

      {/* menu toggle for small screen */}
      {menu && (
        <div
          ref={menuRef}
          className=" sm:flex flex-col z-[1000] md:hidden absolute top-[4rem] right-0 backdrop-blur-md
          justify-start h-[calc(100vh-4rem)] items-center w-4/12 gap-y-4"
        >
          <div
            className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed] 
            mt-4 "
            onClick={homeHandler}
          >
            Home
          </div>
          <div
            className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
            onClick={aboutHandler}
          >
            About
          </div>
          <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
            Contact
          </div>
          <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
            Dashboard
          </div>
          <div
            className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
            onClick={talkHandler}
          >
            Talk
          </div>
          <div className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
            Blog
          </div>
        </div>
      )}

      {checkUser && <SiteLoadingModal />}
    </div>
  );
};

export default MainNavbar;
