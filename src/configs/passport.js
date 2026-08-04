import passport from "passport";
import mongoose from "mongoose";
import User from "#models/user.js";
import "#modules/auth/strategies/local.strategy.js";
import "#modules/auth/strategies/google.strategy.js";
import "#modules/auth/strategies/github.strategy.js";

passport.serializeUser((user, done) => {
  done(null, { id: user._id });
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id));

    if (!user) return done(null, false);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
