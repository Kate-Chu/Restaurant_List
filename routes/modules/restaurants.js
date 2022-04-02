const express = require("express");
const router = express.Router();
const RestaurantList = require("../../models/restaurant");
const User = require("../../models/user");

// 搜尋功能
router.get("/:id/search", async (req, res) => {
  const keyword = req.query.keyword;
  const _id = req.params.id;

  if (!keyword) return res.redirect("/");

  const searchResult = await RestaurantList.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ],
    userId: _id,
  }).lean();
  return res.render("index", { items: searchResult, keyword, userId: _id });
});

// 增加餐廳
router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/", async (req, res) => {
  const {
    name,
    rating,
    category,
    phone,
    location,
    google_map,
    description,
    image,
  } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);
  const newRestaurant = await RestaurantList.create({
    name,
    rating,
    category,
    phone,
    location,
    google_map,
    description,
    image,
    userId,
  });
  user.restaurant = newRestaurant._id;
  user.save();

  return res.redirect("/");
});

// 餐廳單頁
router.get("/:id", async (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  const restaurantDetail = await RestaurantList.findOne({ _id, userId }).lean();
  return res.render("restaurant_intro", { item: restaurantDetail });
});

// 編輯頁面
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const editRestaurant = await RestaurantList.findById(id).lean();
  return res.render("edit", { item: editRestaurant });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const editItem = req.body;
  await RestaurantList.findByIdAndUpdate(id, editItem);
  return res.redirect(`/restaurants/${id}`);
});

// 刪除資料
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await RestaurantList.findById(id).remove();
  return res.redirect("/");
});

module.exports = router;
