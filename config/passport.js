const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "email incorrect" });
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(null, false, { message: "password incorrect" });
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )

    // new LocalStrategy(
    //   { usernameField: "email", passReqToCallback: true },
    //   async (req, email, password, done) => {
    //     const user = await User.findOne({ email });
    //     const isMatch = await bcrypt.compare(password, user.password);

    //     if (!user) {
    //       return done(null, false, req.flash("error", "email incorrect"));
    //     }
    //     if (!isMatch) {
    //       return done(null, false, req.flash("error", "password incorrect"));
    //     }
    //     return done(null, user);
    //   }
    // )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        const user = await User.findOne({ email });

        if (user) return done(null, user);

        const randPassword = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(randPassword, 10);
        const newUser = await User.create({
          name,
          email,
          password: hashPassword,
        });
        return done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
