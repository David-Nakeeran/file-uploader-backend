import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmail, isPasswordValid } from "../services/userService.js";
import CustomError from "../errors/customError.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail({ email });

        if (!user) {
          throw new CustomError(404, "User not found");
        }

        const validate = await isPasswordValid(user, password);

        if (!validate) {
          throw new CustomError(400, "Wrong password");
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
