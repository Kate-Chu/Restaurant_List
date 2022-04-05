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
    restaurant: [1, 2, 3],
  },
  {
    name: "User2",
    email: "user2@example.com",
    password: "12345678",
    restaurant: [4, 5, 6],
  },
];

const addSeedData = async () => {
  for await (let user of SEED_USER) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = await new User({
      name: user.name,
      email: user.email,
      password: hashPassword,
    });
    await newUser.save();

    const seedResList = seedRestaurant.results;
    for await (let index of user.restaurant) {
      const newRestaurant = new Restaurant(seedResList[index - 1]);
      newRestaurant.userId = newUser._id;
      newRestaurant.save();
      newUser.restaurant.push(newRestaurant);
    }
    await newUser.save();
  }
};

db.once("open", async () => {
  await addSeedData();
  process.exit();
});
