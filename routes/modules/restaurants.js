const express = require("express");
const router = express.Router();
const RestaurantList = require("../../models/restaurant");

// 增加餐廳
router.get("/create", (req, res) => {
  RestaurantList.find()
    .lean()
    .then((restaurantList) => {
      res.render("create");
    });
});

router.post("/", (req, res) => {
  const newRestaurant = req.body;
  return RestaurantList.create(newRestaurant)
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error));
});

// 餐廳單頁
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render("restaurant_intro", { item: restaurant }))
    .catch((error) => console.error(error));
});

// 編輯頁面
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { item: restaurant }))
    .catch((error) => console.error(error));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const editItem = req.body;
  return RestaurantList.findByIdAndUpdate(id, editItem)
    .then(() => {
      res.redirect(`/restaurants/${id}`);
    })
    .catch((error) => console.error(error));
});

// 刪除資料
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
