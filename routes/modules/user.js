const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/users/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    console.log("User already exists.");
    return res.render("register", { name, email });
  }
  await User.create({ name, email, password });
  return res.redirect("/");
});

module.exports = router;
