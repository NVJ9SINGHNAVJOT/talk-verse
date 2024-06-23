import { logInApi } from "@/services/operations/authApi";
import { setAuthUser, setLoading } from "@/redux/slices/authSlice";
import { setUser } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setMyId } from "@/redux/slices/messagesSlice";

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
      // for multiple tabs set CHECK_USER_IN_MULTI_TAB to "true"
      localStorage.setItem(process.env.CHECK_USER_IN_MULTI_TAB as string, JSON.stringify("true"));

      dispatch(setUser(response.user));
      dispatch(setMyId(response.user._id));
      navigate("/");

      setTimeout(() => {
        dispatch(setAuthUser(true));
      }, 1000); // Delay for 1 second
    } else {
      toast.error("Error while logging, try again");
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-evenly">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex w-10/12 flex-col items-center justify-evenly gap-4 lm:w-7/12"
      >
        <h2 className="text-center font-sans text-xl font-semibold text-white">Log In to TalkVerse</h2>

        <div className="group relative z-0 mb-5 w-full">
          <input
            type="email"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && <span className="absolute text-[0.7rem] text-red-600">Invalid format</span>}

          <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4">
            Email address
          </label>
        </div>

        <div className="grou relative z-0 mb-5 w-full pb-4">
          <input
            type="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("password", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
          />
          {errors.password && (
            <span className="absolute text-[0.7rem] text-red-600">
              lowercase, uppercase, digit, special character and Length: min - 8, max - 20
            </span>
          )}

          <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4">
            Password
          </label>
        </div>

        <div className="group relative z-0 mb-5 w-full pb-4">
          <input
            type="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("confirmPassword", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
          />
          {errors.password && (
            <span className="absolute text-[0.7rem] text-red-600">
              lowercase, uppercase, digit, special character and Length: min - 8, max - 20
            </span>
          )}

          <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4">
            Confirm Password
          </label>
        </div>

        <button disabled={isLogin} type="submit" className="w-full rounded-sm bg-white p-1 text-black">
          Submit
        </button>
      </form>

      <div className="flex flex-col items-center gap-5">
        <div className="text-center text-white">Not a member yet? Join the conversation today!</div>

        <button className="rounded-sm bg-white p-1 pl-4 pr-4 text-black" onClick={toggleSignIn}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LogIn;
