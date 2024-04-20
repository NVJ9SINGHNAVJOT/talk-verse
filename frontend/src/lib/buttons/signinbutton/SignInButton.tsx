import { useNavigate } from "react-router-dom";
import "@/lib/buttons/signinbutton/SignInButton.css";
import { setIsLogin } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

type SignInButtonProps = {
    title: string;
};

const SignInButton = (props: SignInButtonProps) => {

    const dispatch = useDispatch();

    const title = props.title;
    const navigate = useNavigate();
    const loginHandler = () => {
        if (title === "Log In") {
            dispatch(setIsLogin(true));
        }
        else {
            dispatch(setIsLogin(false));
        }
        navigate("/login");
    };

    return (
        <div
            className="signButton text-richblack-25 cursor-pointer "
            onClick={loginHandler}
        >
            {title}
        </div>
    );
};

export default SignInButton;
