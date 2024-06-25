import { configDotenv } from "dotenv";
import { logger } from "@/logger/logger";
import nodemailer from "nodemailer";
import { passwordUpdatedTemplate, privateKeyTemplate, verificationTemplate } from "@/utils/templates";

configDotenv();

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

const sendMail = async (email: string, title: string, body: string): Promise<nodemailer.SentMessageInfo> => {
  try {
    const transporter = nodemailer.createTransport({
      host: `${process.env["MAIL_HOST"]}`,
      auth: {
        user: `${process.env["MAIL_USER"]}`,
        pass: `${process.env["MAIL_PASS"]}`,
      },
    });

    const mailOptions: MailOptions = {
      from: "TalkVerse",
      to: email,
      subject: title,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending mail", { error: error.message });
    throw error;
  }
};

export const sendVerficationMail = async (email: string, otp: string) => {
  try {
    await sendMail(email, "Verification Email", verificationTemplate(otp));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending verification mail", { error: error, email: email });
    throw error;
  }
};

export const sendPasswordUpdatedMail = async (userName: string, email: string) => {
  try {
    await sendMail(email, "Password Updated", passwordUpdatedTemplate(userName, email));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending password updated mail", { error: error, email: email });
    throw error;
  }
};

export const sendPrivateKeyMail = async (email: string, privateKey: string) => {
  try {
    await sendMail(email, "Private Key - TalkVerse", privateKeyTemplate(email, privateKey));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while sending private key mail", { error: error, email: email });
    throw error;
  }
};
