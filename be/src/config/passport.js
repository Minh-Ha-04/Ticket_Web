import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import models from "../models/index.js";
import dotenv from 'dotenv';

dotenv.config();
const { User } = models;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => 
    {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            password: "",
            role: "user",
            isActive: true,
          });
        } else if (!user.isActive) {
          user.isActive = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
