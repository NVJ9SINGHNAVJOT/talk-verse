import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/mainLogo.png"
import SignInButton from "../buttons/signinbutton/SignInButton";

const MainNavbar = () => {

  const navigate = useNavigate()
  const homeHandler = () => {
    navigate("/")
  }

  const talkHandler = () => {
    navigate("/talk")
  }


  return (

    <div className="navbarBackground w-screen h-[4rem] flex justify-between items-center">

      {/* main logo and name */}
      <div className="flex items-center justify-evenly gap-5 ml-8">
        <img alt="Logo" src={mainLogo} className="h-14 cursor-pointer" onClick={homeHandler} />
        <div className="mainLogoButton text-2xl font-semibold  text-richblack-25 " role="button" onClick={homeHandler}>
          TalkVerse
        </div>
      </div>


      {/* navbar menu */}
      <div className="flex justify-evenly items-center gap-5">

        <div className=" text-white menuGlow cursor-pointer round rounded-sm" onClick={homeHandler}>
          Home
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm">
          About
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm">
          Contact
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm">
          Dashboard
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm" onClick={talkHandler}>
          Talk
        </div>
        <div className=" text-white menuGlow cursor-pointer round rounded-sm">
          Blog
        </div>

      </div>


      {/* sign in buttons */}
      <div className="flex justify-evenly items-center gap-5 mr-8">

        <SignInButton title={"Log In"} />

        <SignInButton title={"Sign In"} />

      </div>


    </div>


  )
}

export default MainNavbar