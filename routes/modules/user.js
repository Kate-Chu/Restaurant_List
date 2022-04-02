const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login",
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "logout successfully");
  res.redirect("/users/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  const existUser = await User.findOne({ email });

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "all fields required" });
  }

  if (password !== confirmPassword) {
    errors.push({ message: "confirm password is different" });
  }

  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
    });
  }

  if (existUser) {
    req.flash("warning_msg", "this email already exists");
    return res.render("register", { name, email });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashPassword });
  return res.redirect("/");
});

module.exports = router;
