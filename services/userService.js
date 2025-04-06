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
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      const error = new Error("User not found");
      err.code = "P2025";
      throw new DatabaseError(error);
    }
    return user;
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const getUserByEmail = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const setUserEmailTokenToNull = async ({ id }) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        emailVerificationToken: null,
      },
    });
    return user;
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const setUserEmailToken = async ({ id }, hashedToken) => {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        emailVerificationToken: hashedToken,
      },
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const deleteExpiredUser = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 Hours ago
    await prisma.user.deleteMany({
      where: {
        isVerified: false,
        createdAt: {
          lt: oneDayAgo, // If createdAt less than oneDayAgo delete
        },
      },
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const isPasswordValid = async (user, password) => {
  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return false;
    }
    return true;
  } catch (err) {
    throw new DatabaseError(err);
  }
};

export const setUserRefreshToken = async (user, refreshToken) => {
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    throw new DatabaseError(err);
  }
};
