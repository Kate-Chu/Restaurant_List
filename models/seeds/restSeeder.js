const db = require("../../config/mongoose");
const User = require("../user");
const Restaurant = require("../restaurant");
const bcrypt = require("bcryptjs");
const seedRestaurant = require("./restaurant.json");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const SEED_USER = [
  {
    name: "User1",
    email: "user1@example.com",
    password: "12345678",
  },
  {
    name: "User2",
    email: "user2@example.com",
    password: "12345678",
  },
];

const addSeedUser = async () => {
  SEED_USER.forEach(async (user) => {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: hashPassword,
    });
    await newUser.save();
  });
};

const addSeedRestaurant = async () => {
  // Promise.all([
  //   User.findOne({ email: "user1@example.com" }),
  //   User.findOne({ email: "user2@example.com" }),
  // ]).then(async () => {
  const user1 = await User.findOne({ email: "user1@example.com" });
  const user2 = await User.findOne({ email: "user2@example.com" });
  const seedResList = seedRestaurant.results;

  for (let i = 0; i < 3; i++) {
    const newRestaurant = new Restaurant(seedResList[i]);
    newRestaurant.userId = user1._id;
    newRestaurant.save();
    user1.restaurant.push(newRestaurant);
  }
  await user1.save();

  for (let i = 3; i < 6; i++) {
    const newRestaurant = new Restaurant(seedResList[i]);
    newRestaurant.userId = user2._id;
    newRestaurant.save();
    user2.restaurant.push(newRestaurant);
  }
  await user2.save();
  // });
};

db.once("open", () => {
  addSeedUser();
  setTimeout(() => addSeedRestaurant(), 5000);
});
