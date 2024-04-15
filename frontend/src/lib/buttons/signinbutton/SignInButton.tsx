import { useNavigate } from "react-router-dom";
import "@/lib/buttons/signinbutton/SignInButton.css";

type SignInButtonProps = {
    title: string,
}

const SignInButton = (props: SignInButtonProps) => {

    const title = props.title;
    const navigate = useNavigate();
    const loginHandler = () => {
        navigate("/login");
    };

    return (
        <div className="signButton text-richblack-25 cursor-pointer " onClick={loginHandler}>
            {title}
        </div>
    );
};

export default SignInButton;