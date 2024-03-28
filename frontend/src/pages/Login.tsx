import { useState } from "react";
import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";


const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => { setIsLogin((prev: boolean) => !prev) };

  return (
    <div className='loginPage w-full h-full flex justify-center items-center overflow-y-auto'
    >
      {isLogin ? (<LogIn toggleSignIn={toggleSignIn} />) : (<SignUp toggleSignIn={toggleSignIn} />)}
        
    </div>

  );
};

export default Login;
