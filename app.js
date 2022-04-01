const port = 3000;
const express = require("express");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const routes = require("./routes");
require("./config/mongoose");

const app = express();

app.engine("handlebars", expHbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "TopSecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(routes);

// 監聽 localhost:3000
app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`);
});
