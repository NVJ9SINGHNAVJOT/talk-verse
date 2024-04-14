import { useState } from "react";
import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";
import LoginRightSide from "@/components/login/loginrightside/LoginRightSide";


const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => { setIsLogin((prev: boolean) => !prev) };

  return (
    <div className='w-full min-h-[calc(100vh-4rem)] flex justify-center loginPage'>


      {/* left part */}
      <div className="flex justify-center w-1/2 h-full]">

        {isLogin ? (<LogIn toggleSignIn={toggleSignIn} />) : (<SignUp toggleSignIn={toggleSignIn} />)}

      </div>




      {/* right part */}
      <LoginRightSide />


    </div>

  );
};

export default Login;
