const express = require("express");
const app = express();
const port = 3000;
const expHbs = require("express-handlebars");
const methodOverride = require("method-override");
const routes = require("./routes");
const RestaurantList = require("./models/restaurant");
require("./config/mongoose");

app.engine("handlebars", expHbs.engine({ defaultLayout: "main" }));
app.use(express.static("public"));
app.set("view engine", "handlebars");

// body-parser
const bodyParser = require("body-parser");
const { route } = require("./routes");
app.use(bodyParser.urlencoded({ extended: true }));



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
