const express = require("express");
const router = express.Router();

const RestaurantList = require("../../models/restaurant");

// 首頁
router.get("/", (req, res) => {
  RestaurantList.find()
    .lean()
    .then((restaurants) => res.render("index", { item: restaurants }))
    .catch((error) => console.error(error));
});

module.exports = router;
