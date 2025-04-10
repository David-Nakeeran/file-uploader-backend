import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmail, isPasswordValid } from "../services/userService.js";

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await isPasswordValid(user, password);

        if (!validate) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
