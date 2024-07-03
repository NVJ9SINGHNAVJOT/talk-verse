import { useState } from "react";
import { toast } from "react-toastify";

type OtpInputProps = {
  // eslint-disable-next-line no-unused-vars
  signUpUser: (otp: string) => Promise<void>;
};

const OtpInput = (props: OtpInputProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>();

  const otpHandler = () => {
    setLoading(true);
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      toast.info("6 digit otp is required");
    } else {
      props.signUpUser(otp);
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 text-white">
      <h2 className="font-be-veitnam-pro text-2xl">OTP Verification</h2>
      <p>Enter the 6-digit OTP you have received</p>
      <input
        maxLength={6}
        placeholder="Enter Otp"
        onChange={(event) => setOtp(event.target.value)}
        className="h-12 w-40 rounded-lg border-[2px] border-transparent bg-[#0a161b] px-1 
        pb-1 text-center tracking-[0.5rem] text-white outline-none outline-[none] duration-200 
        placeholder:text-[0.8rem] placeholder:-tracking-normal focus:border-[rgb(152,88,255)]"
      />
      <button
        disabled={loading || !otp || otp.length !== 6}
        onClick={otpHandler}
        className="w-10/12 rounded-sm bg-white p-1 text-black"
      >
        Submit
      </button>
    </div>
  );
};

export default OtpInput;
