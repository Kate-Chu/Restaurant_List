const express = require("express");
const router = express.Router();
const RestaurantData = require("../../models/restaurant");

// 首頁
router.get("/", async (req, res) => {
  const sortSelect = req.query.sort;
  const userId = req.user._id;
  let sortedData;

  switch (sortSelect) {
    case "Z -> A":
      sortedData = await RestaurantData.find({ userId })
        .sort({ name: "desc" })
        .lean();
      return res.render("index", { items: sortedData, userId });

    case "category":
      sortedData = await RestaurantData.find({ userId })
        .sort({ category: "asc" })
        .lean();
      return res.render("index", { items: sortedData, userId });

    case "location":
      sortedData = await RestaurantData.find({ userId })
        .sort({ location: "asc" })
        .lean();
      return res.render("index", { items: sortedData, userId });

    default:
      sortedData = await RestaurantData.find({ userId })
        .sort({ name: "asc" })
        .lean();
      return res.render("index", { items: sortedData, userId });
  }
});

module.exports = router;
