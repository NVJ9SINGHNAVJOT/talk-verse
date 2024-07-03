import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from "@/services/operations/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type NewPassword = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};
const ResetPassword = () => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPassword>();

  const submit = async (data: NewPassword) => {
    setLoading(true);
    if (step === 0) {
      const response = await sendOtpApi(data.email, "no");
      if (!response) {
        toast.error("error while sending otp");
      } else if (response.success === false) {
        toast.info(response.message);
      } else {
        toast.success("otp send, check your mail");
        setStep((prev) => prev + 1);
      }
    } else if (step === 1) {
      const response = await verifyOtpApi(data.email, data.otp);
      if (!response) {
        toast.error("error while checking otp");
      } else if (response.success === false) {
        toast.info(response.message);
      } else {
        toast.success("otp verified");
        setStep((prev) => prev + 1);
      }
    } else {
      const response = await resetPasswordApi(data);
      if (!response) {
        toast.error("error while reseting password");
      } else if (response.success === false) {
        toast.info(response.message);
      } else {
        toast.success("password reset done");
        navigate("/login");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className=" relative flex flex-col items-center justify-center w-full min-w-minContent max-w-maxContent h-[calc(100vh-4rem)] 
    gap-8 overflow-y-auto"
    >
      <div className=" absolute z-50 self-center">
        <form onSubmit={handleSubmit(submit)} className=" text-white flex flex-col items-center gap-y-14 ">
          {step === 0 && (
            <div className=" flex flex-col items-center gap-y-14">
              <p className=" text-2xl">Enter your registered email id with TalkVerse</p>
              <input
                type="email"
                className="w-56 outline-none text-black rounded-lg p-2 bg-white"
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                placeholder="Email"
              />
            </div>
          )}
          {step === 1 && (
            <div className=" flex flex-col items-center gap-y-14">
              <p className=" text-2xl">Enter your registered email id with TalkVerse</p>
              <input
                type="number"
                className="w-56 outline-none text-black rounded-lg p-2 bg-white"
                {...register("otp", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                placeholder="Email"
              />
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className=" w-fit rounded-sm bg-white py-1 px-10 text-black hover:scale-110 transition-all ease-in-out "
          >
            Submit
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default ResetPassword;
