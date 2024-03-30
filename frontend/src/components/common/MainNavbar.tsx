import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/mainLogo.png"

const MainNavbar = () => {

  const navigate = useNavigate()
  const homeHandler = () => {
    navigate("/")
  }
  const loginHandler = () => {
    navigate("/login")
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
        
        <div className=" text-white menuGlow cursor-pointer round rounded-sm">
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

      </div>


      {/* sign in buttons */}
      <div className="flex justify-evenly items-center gap-5 mr-8">
        <div className="signButton text-richblack-25 cursor-pointer " onClick={loginHandler}>
          Log In
        </div>

        <div className="signButton text-richblack-25 cursor-pointer " onClick={loginHandler}>
          Sign Up
        </div>
      </div>


    </div>


  )
}

export default MainNavbar