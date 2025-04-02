import CustomError from "../errors/customError.js";
import { PrismaClient, Prisma } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { generateEmailVerificationToken } from "../auth/emailAuth.js";
import { sendVerificationEmail } from "../services/mailService.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient().$extends(withAccelerate());

export const createUser = async (newUser, password) => {
  try {
    const { fullName, email } = newUser;
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: password,
      },
    });

    const verificationToken = generateEmailVerificationToken(user.id);

    const hashedToken = await bcrypt.hash(verificationToken, 10);

    const userUpdated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken: hashedToken,
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

    return user;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new CustomError(400, "Email is already in use");
      }
    }
  }
};

export const updateUserVerified = async (userId) => {
  try {
    const userVerified = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
        emailVerificationToken: null,
      },
    });
    return userVerified;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(err);
    }
  }
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const getUserByEmail = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};
