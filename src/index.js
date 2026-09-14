const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const route = require("./resources/Routers/index");

const app = express();
const port = 3000;

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatVND: (value) => formatVND(value),
    },
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

route(app);

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
