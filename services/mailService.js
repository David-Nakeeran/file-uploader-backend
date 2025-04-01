import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";
import CustomError from "../errors/customError.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, verificationToken) => {
  try {
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    const { data, error } = await resend.emails.send({
      from: "NoReply <noreply@davidnakeeran.dev>",
      to: [to],
      subject: "Verify Your Account",
      html: `<strong>Click the link to verify your mail:</strong><br><a href="${verificationLink}">Verify email</a>
      `,
    });
    return data;
  } catch (error) {
    throw new CustomError(500, "Email could not be sent");
  }
};
