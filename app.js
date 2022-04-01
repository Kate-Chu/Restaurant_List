const port = 3000;
const express = require("express");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const routes = require("./routes");
require("./config/mongoose");
const usePassport = require("./config/passport");
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

usePassport(app);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use(routes);

app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`);
});
