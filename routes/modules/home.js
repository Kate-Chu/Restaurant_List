const express = require("express");
const router = express.Router();

const RestaurantList = require("../../models/restaurant");

// 首頁
router.get("/", (req, res) => {
  const sortSelect = req.query.sort;

  switch (sortSelect) {
    case "Z -> A":
      RestaurantList.find()
        .lean()
        .sort({ name: "desc" })
        .then((restaurants) => res.render("index", { item: restaurants }))
        .catch((error) => console.error(error));
      break;
    case "category":
      RestaurantList.find()
        .lean()
        .sort({ category: "asc" })
        .then((restaurants) => res.render("index", { item: restaurants }))
        .catch((error) => console.error(error));
      break;
    case "location":
      RestaurantList.find()
        .lean()
        .sort({ location: "asc" })
        .then((restaurants) => res.render("index", { item: restaurants }))
        .catch((error) => console.error(error));
      break;
    default:
      RestaurantList.find()
        .lean()
        .sort({ name: "asc" })
        .then((restaurants) => res.render("index", { item: restaurants }))
        .catch((error) => console.error(error));
  }
});

module.exports = router;
