import { logInApi } from "@/services/operations/authApi";
import { setAuthUser, setLoading } from "@/redux/slices/authSlice";
import { setUser } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type LogInData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignInProps = {
  toggleSignIn: () => void;
};

const LogIn = (props: SignInProps) => {
  const { toggleSignIn } = props;

  const isLogin = useAppSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogInData>();
  const navigate = useNavigate();

  const onSubmitForm = async (data: LogInData) => {
    reset();
    dispatch(setLoading(true));

    const tid = toast.loading("Loading...");

    const response = await logInApi(data);

    toast.dismiss(tid);
    dispatch(setLoading(false));

    if (response && response.success === true) {
      dispatch(setUser(response.user));
      navigate("/");

      setTimeout(() => {
        dispatch(setAuthUser(true));
      }, 1000); // Delay for 1 second
    } else {
      toast.error("Error while logging, try again");
    }
  };

  return (
    <div className=" w-full flex flex-col justify-evenly items-center">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex w-10/12 lm:w-7/12 flex-col justify-evenly items-center gap-4"
      >
        <h2 className=" text-center text-xl text-white font-sans font-semibold">
          Log In to TalkVerse
        </h2>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && (
            <span className=" absolute text-red-600 text-[0.7rem]">
              Invalid format
            </span>
          )}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 grou pb-4">
          <input
            type="password"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("password", {
              required: true,
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
          />
          {errors.password && (
            <span className=" absolute text-red-600 text-[0.7rem]">
              lowercase, uppercase, digit, special character and Length: min -
              8, max - 20
            </span>
          )}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm 
            duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group pb-4">
          <input
            type="password"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("confirmPassword", {
              required: true,
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
          />
          {errors.password && (
            <span className=" absolute text-red-600 text-[0.7rem]">
              lowercase, uppercase, digit, special character and Length: min -
              8, max - 20
            </span>
          )}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm
            duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm Password
          </label>
        </div>

        <button
          disabled={isLogin}
          type="submit"
          className=" bg-white text-black p-1 rounded-sm w-full"
        >
          Submit
        </button>
      </form>

      <div className="flex flex-col items-center gap-5">
        <div className="text-white text-center ">
          Not a member yet? Join the conversation today!
        </div>

        <button
          className=" bg-white text-black pl-4 pr-4 p-1 rounded-sm "
          onClick={toggleSignIn}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LogIn;
