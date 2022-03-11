const mongoose = require("mongoose");
const Restaurants = require("../restaurant");
const restaurantList = require("../restaurant.json");

mongoose.connect("mongodb://localhost/restaurant_list");

const db = mongoose.connection;

db.on("error", () => {
  console.log("restaurantSeeder.js: MongoDB error!");
});

db.once("open", () => {
  console.log("restaurantSeeder.js: MongoDB connected!");

  restaurantList.results.forEach((restaurant) => {
    Restaurants.create(restaurant);
  });
});
