const express = require("express");
const app = express();
const port = 3000;

const exphbs = require("express-handlebars");
const restaurantList = require("./restaurant.json");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(express.static("public"));
app.set("view engine", "handlebars");

// 首頁
app.get("/", (req, res) => {
  res.render("index", { restaurant: restaurantList.results });
});

// 餐廳單頁
app.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  );
  console.log(restaurant);

  res.render("restaurant_intro", { restaurant });
});

// 監聽 localhost:3000
app.listen(port, (req, res) => {
  console.log(`Express is listening on localhost:${port}`);
});
