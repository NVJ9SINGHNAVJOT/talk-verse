import { configDotenv } from "dotenv";
import { logger } from "@/logger/logger";
import nodemailer from "nodemailer";
import { passwordUpdatedTemplate, privateKeyTemplate, verificationTemplate } from "@/utils/templates";
configDotenv();

const sendMail = async (email: string, title: string, body: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: `${process.env["MAIL_HOST"]}`,
    auth: {
      user: `${process.env["MAIL_USER"]}`,
      pass: `${process.env["MAIL_PASS"]}`,
    },
  });

  /*
    FIXME: for invalid email id, nodemailer throws error only some times. 
    this need to be changed and error to be thrown every time.
  */
  await transporter.sendMail({ from: "TalkVerse", to: email, subject: title, html: body });
};

export const sendVerficationMail = async (email: string, otp: string) => {
  try {
    await sendMail(email, "Verification Email", verificationTemplate(otp));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending verification mail", { error: error.message, email: email });
    throw error;
  }
};

export const sendForgotPasswordVerificationMail = async (email: string, otp: string) => {
  try {
    await sendMail(email, "Reset Password For TalkVerse", verificationTemplate(otp));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending forgot password verification mail", { error: error.message, email: email });
    throw error;
  }
};

export const sendPasswordUpdatedMail = async (userName: string, email: string) => {
  try {
    await sendMail(email, "Password Updated", passwordUpdatedTemplate(userName, email));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // NOTE: no error is thrown to controller
    logger.error("error while sending password updated mail", { error: error.message, email: email });
  }
};

export const sendPrivateKeyMail = async (email: string, privateKey: string) => {
  try {
    await sendMail(email, "Private Key - TalkVerse", privateKeyTemplate(email, privateKey));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // NOTE: no error is thrown to controller
    logger.error("error while sending private key mail", {
      error: error.message,
      email: email,
      privateKey: privateKey,
    });
  }
};
