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

app.use((req, res, next) => {
  const err = new Error("Không tìm thấy trang");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(err.stack || err.message);

  res.status(status).send(`
    <html>
      <head>
        <title>Lỗi ${status}</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>${status}</h1>
        <p>${err.message || "Có lỗi xảy ra trên hệ thống."}</p>
        <a href="/">Quay lại trang chủ</a>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
