import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/images/mainLogo.png";
import SignInButton from "@/lib/buttons/signinbutton/SignInButton";
import { useAppSelector } from "@/redux/store";
import UserMenu from "@/components/common/UserMenu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef, useState } from "react";
import SideMenu from "@/components/common/SideMenu";

const MainNavbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const authUser = useAppSelector((state) => state.auth.authUser);
  const myPrivateKey = useAppSelector((state) => state.messages.myPrivateKey);
  const [menu, setMenu] = useState<boolean>(false);

  const menuRefExclude = useRef<HTMLDivElement>(null);

  const toogleMenu = () => {
    setMenu((prev) => !prev);
  };

  const homeHandler = () => {
    if (menu) {
      setMenu(false);
    }
    navigate("/");
  };

  const aboutHandler = () => {
    if (menu) {
      setMenu(false);
    }
    navigate("/about");
  };

  const contactHandler = () => {
    if (menu) {
      setMenu(false);
    }
    navigate("/contact");
  };

  const talkHandler = () => {
    if (menu) {
      setMenu(false);
    }
    if (authUser) {
      if (myPrivateKey !== undefined) {
        navigate("/talk");
      } else {
        navigate("/checkKey");
      }
    } else {
      navigate("/login");
    }
  };

  const blogHandler = () => {
    if (menu) {
      setMenu(false);
    }
    navigate("/blog/trending");
  };

  return (
    <div
      className="relative bg-[radial-gradient(circle_at_24.1%_68.8%,_rgb(50,_50,_50)_0%,_rgb(0,_0,_0)_99.4%)]
        h-[4rem] flex justify-between items-center w-full"
    >
      {/* main logo and name */}
      <div className="flex items-center justify-evenly gap-5 ml-8">
        <img alt="Logo" src={mainLogo} className="h-14 cursor-pointer" onClick={homeHandler} />
        <div
          className="ct-mainLogoButton text-2xl font-semibold  text-richblack-25 "
          role="button"
          onClick={homeHandler}
        >
          TalkVerse
        </div>
      </div>

      {/* navbar menu */}
      <div className="hidden md:flex justify-evenly items-center md:gap-4 lm:gap-6 lg:gap-8">
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
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={contactHandler}
        >
          Contact
        </div>
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={talkHandler}
        >
          Talk
        </div>
        <div
          className=" text-white  cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]"
          onClick={blogHandler}
        >
          Blog
        </div>
      </div>

      {/* sign in buttons or user logo */}
      {user ? (
        <div className={`flex justify-evenly items-center md:gap-2 gap-x-2 mr-8 `}>
          <UserMenu />
          <div ref={menuRefExclude} onClick={toogleMenu} className="md:hidden">
            <GiHamburgerMenu className="cursor-pointer w-6 h-8 ml-2 aspect-auto text-white rounded-sm" />
          </div>
        </div>
      ) : (
        <div className={`flex justify-evenly items-center gap-3 lg:gap-5 mr-8`}>
          <SignInButton title={"Log In"} />
          <SignInButton title={"Sign Up"} />

          <div ref={menuRefExclude} onClick={toogleMenu} className=" md:hidden">
            <GiHamburgerMenu className="cursor-pointer w-6 h-8 ml-2 aspect-auto text-white rounded-sm" />
          </div>
        </div>
      )}

      {/* menu toggle for small screen */}
      {menu && (
        <SideMenu
          menuRefExclude={menuRefExclude}
          setMenu={setMenu}
          homeHandler={homeHandler}
          aboutHandler={aboutHandler}
          contactHandler={contactHandler}
          talkHandler={talkHandler}
          blogHandler={blogHandler}
        />
      )}
    </div>
  );
};

export default MainNavbar;
