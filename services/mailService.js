import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";
import CustomError from "../errors/customError.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, verificationToken) => {
  try {
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    const { data } = await resend.emails.send({
      from: "NoReply <noreply@davidnakeeran.dev>",
      to: [to],
      subject: "Verify Your Account",
      html: `
      <p>Thank you for signing up. Please confirm your email address by clicking the link below.</p>
      <strong>Click the link to verify your mail:</strong><br><a href="${verificationLink}">Verify email</a>
      <p>If you didn't register for an account, please ignore this email.</p>`,
    });

    return data;
  } catch (error) {
    throw new CustomError(500, "Email could not be sent");
  }
};
