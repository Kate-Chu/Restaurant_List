const restaurantList = require("../restaurant.json");
const db = require("../../config/mongoose");
const Restaurants = require("../restaurant");

db.once("open", () => {
  console.log("restaurantSeeder.js: MongoDB connected!");

  restaurantList.results.forEach((restaurant) => {
    Restaurants.create(restaurant);
  });
});
