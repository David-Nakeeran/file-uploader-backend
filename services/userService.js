import DatabaseError from "../errors/databaseError.js";
import { PrismaClient } from "@prisma/client";
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
    console.log(err);
    throw new DatabaseError(err);
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
    throw new DatabaseError(err);
  }
};

export const getUserById = async (userId) => {
  // Add try catch
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const getUserByEmail = async ({ email }) => {
  // Add try catch
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

export const isUserVerified = async () => {
  try {
  } catch (err) {
    throw new DatabaseError(err);
  }
};
