import CustomError from "../errors/customError.js";
import { PrismaClient, Prisma } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

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
    return user;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new CustomError(400, "Email is already in use");
      }
    }
  }
};
