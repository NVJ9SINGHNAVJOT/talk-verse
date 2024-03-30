import { useState } from "react";
import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";


const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => { setIsLogin((prev: boolean) => !prev) };

  return (
    <div className='w-full min-h-[calc(100vh-4rem)] flex justify-center loginPage'>


      {/* left part */}
      <div className="flex justify-center w-1/2  min-h-[calc(100vh-4rem)]">

        {isLogin ? (<LogIn toggleSignIn={toggleSignIn} />) : (<SignUp toggleSignIn={toggleSignIn} />)}

      </div>




      {/* right part */}
      <div className=" w-1/2  min-h-[calc(100vh-4rem)]">

        <button className="loginSidePage" type="button">

          <strong className="strongForLoginPage">
            <div className=" text-4xl text-white pl-8 pr-8">
              Welcome to <span className=" blinkingHeading  text-richblack-400">TalkVerse!</span>
              Connect, share, and engage in conversations that matter. Log in to your world of words and wisdom.
            </div>
          </strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>

        </button>

      </div>


    </div>

  );
};

export default Login;
