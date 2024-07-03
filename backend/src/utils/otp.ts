import Otp from "@/db/mongodb/models/Otp";

export const generateOTP = async (email: string): Promise<string> => {
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email: email, otpValue: newOtp });
  return newOtp;
};

export const checkOTP = async (email: string, otp: string): Promise<boolean> => {
  // Find the most recent OTP for the email
  const response = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1);

  if (response.length !== 1 || !response[0]) {
    // OTP not found for the email
    return false;
  } else if (otp !== response[0].otpValue) {
    // Invalid OTP
    return false;
  }
  return true;
};
