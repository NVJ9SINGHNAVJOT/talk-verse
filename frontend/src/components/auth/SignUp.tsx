import { signUpApi } from "@/services/operations/authApi";
import { setIsLogin, setLoading } from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/store";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

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

  const isLogin = useAppSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const { toggleSignIn } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleimgTagRefClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (validTypes.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
        setSelectedFile(null);
      }
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignUpData>();

  const onSubmitForm = async (data: SignUpData): Promise<void> => {

    dispatch(setLoading(true));
    const tid = toast.loading("Loading...");

    const newSignUpData = new FormData();

    if (selectedFile) {
      newSignUpData.append("imageFile", selectedFile);
    }
    newSignUpData.append("firstName", data.firstName);
    newSignUpData.append("lastName", data.lastName);
    newSignUpData.append("userName", data.userName);
    newSignUpData.append("email", data.email);
    newSignUpData.append("password", data.password);
    newSignUpData.append("confirmPassword", data.confirmPassword);

    reset();
    setSelectedFile(null);

    const response: boolean = await signUpApi(newSignUpData);

    toast.dismiss(tid);
    dispatch(setLoading(false));

    if (response === true) {
      toast.success("Sign Up completed");
      dispatch(setIsLogin(true));
    }
    else {
      toast.error("Error while Signig Up, Try again");
    }
  };

  return (
    <div className=" w-full flex flex-col justify-evenly items-center">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex sm:w-10/12 lm:w-7/12 flex-col justify-evenly items-center gap-2"
      >
        <h2 className=" text-center text-base text-white font-sans font-semibold">
          Sign Up to TalkVerse
        </h2>
        <p className="text-white text-xs text-center">
          Enter the realm of endless dialogue and discovery. Your journey begins
          here!
        </p>

        {/* image input */}
        <div className="flex justify-center items-center relative w-16 h-16">
          <input
            id="imgInput"
            name="imageInput"
            ref={fileInputRef}
            className="absolute w-5 h-5  hidden"
            type="file"
            accept=".jpg ,.jpeg, .png"
            onChange={handleImageChange}
            placeholder=""
          />
          {selectedFile === null ? (
            <RxAvatar
              onClick={handleimgTagRefClick}
              className="block   absolute w-16 h-16 rounded bg-richblack-300 
              cursor-pointer"
            />
          ) : (
            <img
              src={URL.createObjectURL(selectedFile)}
              onClick={handleimgTagRefClick}
              className="block
                absolute w-16 h-16 object-cover rounded bg-richblack-300 cursor-pointer"
              alt="Avatar"
            />
          )}
        </div>

        {/* signup data */}

        <div className=" flex items-center gap-2 w-full pt-4">
          <div className="relative z-0 w-1/2 mb-5 group">
            <input
              type="text"
              className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              {...register("firstName", { required: true, pattern: /^[a-zA-Z]{2,}$/ })}
            />
            {errors.firstName && <span className=" absolute text-red-600 text-[0.7rem]">Letters, min 2</span>}

            <label
              className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First Name
            </label>
          </div>

          <div className="relative z-0 w-1/2 mb-5 group">
            <input
              type="text"
              className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              {...register("lastName", { required: true, pattern: /^[a-zA-Z]{2,}$/ })}
            />
            {errors.lastName && <span className=" absolute text-red-600 text-[0.7rem]">Letters, min 2</span>}

            <label
              className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last Name
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full mb-5 group pb-1">
          <input
            type="text"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("userName", { required: true, pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/ })}
          />
          {errors.userName && <span className=" absolute text-red-600 text-[0.7rem]"> Characters, min 2</span>}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            User Name
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group pb-1">
          <input
            type="email"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
          />
          {errors.email && <span className=" absolute text-red-600 text-[0.7rem]">Invalid format</span>}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email Address
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group pb-4">
          <input
            type="password"
            className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            {...register("password", {
              required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8, maxLength: 20
            })}
          />
          {errors.password && <span className=" absolute text-red-600 text-[0.7rem]">
            lowercase, uppercase, digit, special character and Length: min - 8, max - 20
          </span>}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
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
              required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8, maxLength: 20
            })}
          />
          {errors.confirmPassword && <span className=" absolute text-red-600 text-[0.7rem]">
            lowercase, uppercase, digit, special character and Length: min - 8, max - 20
          </span>}

          <label
            className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
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
        <div className="text-white text-center ">Already have an account?</div>
        <button
          className=" bg-white text-black pl-4 pr-4 p-1 rounded-sm "
          onClick={toggleSignIn}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SignUp;
