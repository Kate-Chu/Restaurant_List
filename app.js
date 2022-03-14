const express = require("express");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const routes = require("./routes");
require("./config/mongoose");

const port = 3000;

const app = express();

app.engine("handlebars", expHbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(routes);

// 監聽 localhost:3000
app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`);
});
