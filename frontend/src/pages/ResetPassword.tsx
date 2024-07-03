import { BackgroundBeams } from "@/lib/sections/BackgroundBeams";
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from "@/services/operations/authApi";
import { useEffect, useState } from "react";
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
  const [timeLeft, setTimeLeft] = useState<number>(299); // 5 minutes in seconds - 1s => 299 seconds
  const [toggleTime, setToggleTimer] = useState<boolean>(false);
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
        setToggleTimer(true);
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
    } else if (data.password !== data.confirmPassword) {
      toast.info("password not matched");
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

  useEffect(() => {
    if (!toggleTime) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(intervalId); // Stop the countdown when time reaches zero
          setTimeout(() => navigate("/"), 500);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div
      className="relative flex h-[calc(100vh-4rem)] w-full min-w-minContent max-w-maxContent flex-col 
      items-center justify-center gap-8 overflow-y-auto"
    >
      <div className="absolute z-50 self-center flex flex-col items-center gap-y-7">
        {step !== 0 && (
          <div className=" flex flex-col items-center">
            <h2 className=" text-white text-5xl">{formatTime(timeLeft)}</h2>
            <p className=" text-red-700 text-xl animate-pulse">Remaing Time</p>
          </div>
        )}
        <form onSubmit={handleSubmit(submit)} className="flex flex-col items-center gap-y-14 text-white">
          {step === 0 && (
            <div className="flex flex-col items-center gap-y-14">
              <p className="text-2xl">Enter your registered email id with TalkVerse</p>
              <input
                type="email"
                className="w-56 rounded-lg bg-white p-2 text-black outline-none"
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                placeholder="Email"
              />
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col items-center gap-y-14">
              <div className="flex flex-col items-center gap-y-4">
                <h2 className="font-be-veitnam-pro text-2xl">OTP Verification</h2>
                <p>Enter the 6-digit OTP you have received</p>
              </div>
              <input
                minLength={6}
                maxLength={6}
                className="h-12 w-40 rounded-lg bg-white p-2 text-center tracking-[0.5rem] text-black 
                outline-none placeholder:-tracking-normal"
                {...register("otp", {
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                  pattern: /^[1-9][0-9]{5}$/,
                })}
                placeholder="Enter OTP"
              />
            </div>
          )}
          {step === 2 && (
            <div className="relative flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-3">
                <label className="font-be-veitnam-pro text-xl">Password</label>
                <input
                  minLength={8}
                  maxLength={20}
                  className="w-64 rounded-lg bg-white p-2 text-black outline-none"
                  {...register("password", {
                    required: true,
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
                    minLength: 8,
                    maxLength: 20,
                  })}
                  placeholder="Password"
                />
              </div>
              <div className="mb-8 flex flex-col gap-y-3">
                <label className="font-be-veitnam-pro text-xl">Confirm Password</label>
                <input
                  minLength={8}
                  maxLength={20}
                  className="w-64 rounded-lg bg-white p-2 text-black outline-none"
                  {...register("confirmPassword", {
                    required: true,
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
                    minLength: 8,
                    maxLength: 20,
                  })}
                  placeholder="Confirm Password"
                />
              </div>
              {(errors.password || errors.confirmPassword) && (
                <span
                  className="absolute -left-[5rem] top-[14rem] w-[27rem] text-center text-[0.8rem] 
                text-red-400"
                >
                  lowercase, uppercase, digit, special character and Length: min - 8, max - 20
                </span>
              )}
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className={`w-48 rounded-sm bg-white px-10 py-1 text-black transition-all ease-in-out 
              ${loading ? "animate-pulse" : "hover:scale-110"}`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default ResetPassword;
