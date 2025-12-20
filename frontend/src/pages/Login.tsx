import LogIn from "@/components/auth/LogIn";
import SignUp from "@/components/auth/SignUp";
import SignUpSuccess from "@/components/auth/SignUpSuccess";
import LoginRightSide from "@/lib/sections/loginrightside/LoginRightSide";
import { setIsLogin } from "@/redux/slices/authSlice";
import { useAppSelector } from "@/redux/store";
import { useState } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const toggleSignIn = () => {
    dispatch(setIsLogin(!isLogin));
  };

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] flex justify-center 
      bg-[radial-gradient(circle_at_24.1%_68.8%,_rgb(50,_50,_50)_0%,_rgb(0,_0,_0)_99.4%)]"
    >
      {/* left part */}
      <div className="flex justify-center items-center w-1/2">
        {isLogin ? (
          <LogIn toggleSignIn={toggleSignIn} />
        ) : (
          <SignUp toggleSignIn={toggleSignIn} setSuccess={setSuccess} />
        )}
      </div>

      {/* right part */}
      <LoginRightSide />
      {success && <SignUpSuccess setSuccess={setSuccess} />}
    </div>
  );
};

export default Login;
