const express = require("express");
const app = express();
const port = 3000;
const expHbs = require("express-handlebars");
const methodOverride = require("method-override");
const routes = require("./routes");

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
const { route } = require("./routes");
app.use(bodyParser.urlencoded({ extended: true }));

db.on("error", () => {
  console.log("MongoDB error!");
});
db.once("open", () => {
  console.log("MongoDB connected!");
});

// method-override
app.use(methodOverride("_method"));

app.use(routes);

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



// 監聽 localhost:3000
app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`);
});
