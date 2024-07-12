import { sendOtpApi, signUpApi } from "@/services/operations/authApi";
import { setIsLogin, setLoading } from "@/redux/slices/authSlice";
import { useAppSelector } from "@/redux/store";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { maxFileSize, validFiles } from "@/utils/constants";
import OtpInput from "@/components/auth/OtpInput";
import WorkModal from "@/lib/modals/workmodal/WorkModal";
import { checkUserNameApi } from "@/services/operations/profileApi";

type SignUpData = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignInProps = {
  toggleSignIn: () => void;
};

const SignUp = (props: SignInProps) => {
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [signUp, setSignUp] = useState<FormData>();
  const [toggleOtp, setToggleOtp] = useState<boolean>(false);
  const signupLoading = useAppSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const { toggleSignIn } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleimgTagRefClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > maxFileSize) {
        toast.info("Max 5mb image file allowed");
        return;
      }
      const fileType = file.type;
      if (validFiles.image.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
        setSelectedFile(null);
      }

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>();

  const signUpUser = async (otp: string) => {
    if (!signUp) {
      toast.error("Signup Failed, try again");
      return;
    }

    setToggleOtp(false);
    setSigningUp(true);

    signUp.append("otp", otp);

    const response = await signUpApi(signUp);

    if (!response) {
      toast.error("Error while Signig Up, Try again");
    } else if (response.success === false) {
      toast.info(response.message);
    } else {
      dispatch(setIsLogin(true));
      toast.success("Sign Up completed");
    }

    dispatch(setLoading(false));
    setSigningUp(false);
  };

  const sendOtp = async (data: SignUpData): Promise<void> => {
    if (data.password !== data.confirmPassword) {
      toast.info("passwords not matched");
      return;
    }
    dispatch(setLoading(true));

    // check if userName given by user is already in use
    const checkUserNameAlreadyPresent = await checkUserNameApi(data.userName);
    if (!checkUserNameAlreadyPresent) {
      toast.error("error while checking userName");
      dispatch(setLoading(false));
      return;
    }
    if (checkUserNameAlreadyPresent.success === false) {
      toast.info("userName already in use");
      dispatch(setLoading(false));
      return;
    }

    // userName validation done, now send otp
    const tid = toast.loading("Loading...");

    const response = await sendOtpApi(data.email, "yes");
    dispatch(setLoading(false));
    toast.dismiss(tid);

    if (!response) {
      toast.error("Error while sending otp");
      return;
    }

    if (response.success === false) {
      toast.info("Hey, you are already registered with us!");
      return;
    }

    reset();
    // collect and store signup data
    const newSignUpData = new FormData();
    if (selectedFile) {
      newSignUpData.append("imageFile", selectedFile);
      setSelectedFile(null);
    }
    newSignUpData.append("firstName", data.firstName);
    newSignUpData.append("lastName", data.lastName);
    newSignUpData.append("userName", data.userName);
    newSignUpData.append("email", data.email);
    newSignUpData.append("password", data.password);
    newSignUpData.append("confirmPassword", data.confirmPassword);
    setSignUp(newSignUpData);
    toast.info("Check your mail for otp");

    // show otp input ui
    setToggleOtp(true);
    dispatch(setLoading(false));
  };

  return toggleOtp ? (
    <OtpInput submitOtpHandler={signUpUser} />
  ) : (
    <div className="flex w-full flex-col items-center justify-evenly">
      <form
        onSubmit={handleSubmit(sendOtp)}
        className="flex w-10/12 flex-col items-center justify-evenly gap-2 lm:w-7/12"
      >
        <h2 className="text-center font-sans text-base font-semibold text-white">Sign Up to TalkVerse</h2>
        <p className="text-center text-xs text-white">
          Enter the realm of endless dialogue and discovery. Your journey begins here!
        </p>

        {/* image input */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <input
            id="imgInput"
            name="imageInput"
            ref={imageInputRef}
            className="absolute hidden h-5 w-5"
            type="file"
            accept=".jpg ,.jpeg, .png"
            onChange={handleImageChange}
            placeholder=""
          />
          {selectedFile === null ? (
            <RxAvatar
              onClick={handleimgTagRefClick}
              className="absolute block h-16 w-16 cursor-pointer rounded bg-richblack-300"
            />
          ) : (
            <img
              src={URL.createObjectURL(selectedFile)}
              onClick={handleimgTagRefClick}
              className="absolute block h-16 w-16 cursor-pointer rounded bg-richblack-300 object-cover"
              alt="Avatar"
            />
          )}
        </div>

        {/* signup data */}
        <div className="flex w-full items-center gap-2 pt-4">
          <div className="group relative z-0 mb-5 w-1/2">
            <input
              type="text"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 
              text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=""
              required
              {...register("firstName", {
                required: true,
                minLength: 2,
                maxLength: 15,
                pattern: /^[a-zA-Z]{2,}$/,
              })}
            />
            {errors.firstName && <span className="absolute text-[0.7rem] text-red-600">Letters, min 2</span>}

            <label
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white 
            duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
            peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              First Name
            </label>
          </div>

          <div className="group relative z-0 mb-5 w-1/2">
            <input
              type="text"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm 
              text-white focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=""
              required
              {...register("lastName", {
                required: true,
                minLength: 2,
                maxLength: 15,
                pattern: /^[a-zA-Z]{2,}$/,
              })}
            />
            {errors.lastName && <span className="absolute text-[0.7rem] text-red-600">Letters, min 2</span>}

            <label
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
            peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Last Name
            </label>
          </div>
        </div>

        <div className="group relative z-0 mb-5 w-full pb-1">
          <input
            type="text"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm 
            text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("userName", {
              required: true,
              pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/,
              maxLength: 10,
              minLength: 3,
            })}
          />
          {errors.userName && <span className="absolute text-[0.7rem] text-red-600"> Characters, min 3 & max 10</span>}

          <label
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
          peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Username
          </label>
        </div>

        <div className="group relative z-0 mb-5 w-full pb-1">
          <input
            type="email"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm 
            text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && <span className="absolute text-[0.7rem] text-red-600">Invalid format</span>}

          <label
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
          peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Email Address
          </label>
        </div>

        <div className="group relative z-0 mb-5 w-full pb-4">
          <input
            type="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm 
            text-white focus:border-blue-600 focus:outline-none focus:ring-0"
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

          <label
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
          peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Password
          </label>
        </div>

        <div className="group relative z-0 mb-5 w-full pb-4">
          <input
            type="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm 
            text-white focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=""
            required
            {...register("confirmPassword", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
          />
          {errors.confirmPassword && (
            <span className="absolute text-[0.7rem] text-red-600">
              lowercase, uppercase, digit, special character and Length: min - 8, max - 20
            </span>
          )}

          <label
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-white duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 
          peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Confirm Password
          </label>
        </div>

        <button disabled={signupLoading} type="submit" className="w-full rounded-sm bg-white p-1 text-black">
          Submit
        </button>
      </form>

      <div className="flex flex-col items-center gap-5">
        <div className="text-center text-white">Already have an account?</div>
        <button className="rounded-sm bg-white p-1 pl-4 pr-4 text-black" onClick={toggleSignIn}>
          Log In
        </button>
      </div>
      {signingUp && <WorkModal title="Signing Up" />}
    </div>
  );
};

export default SignUp;
