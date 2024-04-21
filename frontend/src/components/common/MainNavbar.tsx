import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/mainLogo.png";
import SignInButton from "@/lib/buttons/signinbutton/SignInButton";
import { useAppSelector } from "@/store/store";
import UserMenu from "@/components/common/UserMenu";

const MainNavbar = () => {

  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const homeHandler = () => {
    navigate("/");
  };

  const talkHandler = () => {
    navigate("/talk");
  };


  return (

    <div className="bg-[radial-gradient(circle_at_24.1%_68.8%,_rgb(50,_50,_50)_0%,_rgb(0,_0,_0)_99.4%)]
      w-screen h-[4rem] flex justify-between items-center"
    >

      {/* main logo and name */}
      <div className="flex items-center justify-evenly gap-5 ml-8">
        <img alt="Logo" src={mainLogo} className="h-14 cursor-pointer" onClick={homeHandler} />
        <div className="mainLogoButton text-2xl font-semibold  text-richblack-25 " role="button" onClick={homeHandler}>
          TalkVerse
        </div>
      </div>

      {/* navbar menu */}
      <div className="flex justify-evenly items-center gap-5">
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={homeHandler}>
          Home
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          About
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Contact
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Dashboard
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]" onClick={talkHandler}>
          Talk
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm hover:[text-shadow:0_0_5px_#59deed]">
          Blog
        </div>
      </div>

      {/* sign in buttons or user logo */}

      {user ?
        <UserMenu />
        :
        <div className="flex justify-evenly items-center gap-5 mr-8">
          <SignInButton title={"Log In"} />
          <SignInButton title={"Sign Up"} />
        </div>
      }

    </div>


  );
};

export default MainNavbar;