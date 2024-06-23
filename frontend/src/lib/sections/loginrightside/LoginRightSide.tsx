import "@/lib/sections/loginrightside/LoginRightSide.css";

const LoginRightSide = () => {
  return (
    <div className=" w-1/2 h-full]">
      <div className="loginSidePage">
        <strong className="strongForLoginPage">
          <div className=" text-center text-2xl lm:text-4xl text-white pl-8 pr-8">
            Welcome to <span className=" blinkingHeading  text-richblack-400">TalkVerse! </span>
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
      </div>
    </div>
  );
};

export default LoginRightSide;
