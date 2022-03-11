const express = require("express");
const app = express();
const port = 3000;
const expHbs = require("express-handlebars");

app.engine("handlebars", expHbs.engine({ defaultLayout: "main" }));
app.use(express.static("public"));
app.set("view engine", "handlebars");

// 資料庫設定
const mongoose = require("mongoose");
const RestaurantList = require("./models/restaurant");
mongoose.connect("mongodb://localhost/restaurant_list");
const db = mongoose.connection;

// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

db.on("error", () => {
  console.log("MongoDB error!");
});
db.once("open", () => {
  console.log("MongoDB connected!");
});

// 首頁
app.get("/", (req, res) => {
  RestaurantList.find()
    .lean()
    .then((restaurants) => res.render("index", { item: restaurants }))
    .catch((error) => console.error(error));
});

// 搜尋功能
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) res.redirect("/");
  RestaurantList.find()
    .lean()
    .then((restaurantList) => {
      const restaurant = restaurantList.filter((restaurant) => {
        return (
          restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      res.render("index", { item: restaurant, keyword });
    })
    .catch((error) => console.error(error));
});

// 增加餐廳
app.get("/restaurants/create", (req, res) => {
  RestaurantList.find()
    .lean()
    .then((restaurantList) => {
      res.render("create");
    });
});

app.post("/restaurants", (req, res) => {
  const newRestaurant = req.body;
  return RestaurantList.create(newRestaurant)
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error));
});

// 餐廳單頁
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render("restaurant_intro", { item: restaurant }))
    .catch((error) => console.error(error));
});

// 編輯頁面
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { item: restaurant }))
    .catch((error) => console.error(error));
});

app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  const editItem = req.body;
  return RestaurantList.findByIdAndUpdate(id, editItem)
    .then(() => {
      res.redirect(`/restaurants/${id}`);
    })
    .catch((error) => console.error(error));
});

// 刪除資料
app.post("/restaurants/:id/delete", (req, res) => {
  const id = req.params.id;
  return RestaurantList.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 監聽 localhost:3000
app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`);
});
