import { useState } from "react";
import { toast } from "react-toastify";

type OtpInputProps = {
  // eslint-disable-next-line no-unused-vars
  submitOtp: (otp: string) => Promise<void>;
};

const OtpInput = (props: OtpInputProps) => {
  const [otp, setOtp] = useState<string>();

  const otpHandler = () => {
    if (!otp || otp.length !== 6) {
      toast.info("6 digit otp is required");
      return;
    }
    props.submitOtp(otp);
  };

  return (
    <div className=" w-full flex flex-col items-center gap-y-4 justify-center text-white">
      <h2 className=" font-be-veitnam-pro text-2xl">OTP Verification</h2>
      <p>Enter the 6-digit OTP you have received</p>
      <input
        placeholder="Enter Otp"
        onChange={(event) => setOtp(event.target.value)}
        className=" bg-[#0a161b] w-24 text-center border-[2px] px-1 pb-1 border-transparent outline-[none]
         text-white duration-200 focus:border-[rgb(152,88,255)] outline-none rounded-lg h-12 placeholder:text-[0.8rem]"
      />
      <button
        onClick={otpHandler}
        className=" bg-white text-black p-1 rounded-sm w-10/12"
      >
        Submit
      </button>
    </div>
  );
};

export default OtpInput;
