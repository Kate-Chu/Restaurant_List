// 資料庫設定
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restaurant_list");
const db = mongoose.connection;

db.on("error", () => {
  console.log("MongoDB error!");
});
db.once("open", () => {
  console.log("MongoDB connected!");
});

module.exports = db;