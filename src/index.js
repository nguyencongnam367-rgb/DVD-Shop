const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 3000;

// Handlebars
app.engine(
  "handlebars",
  engine({
    extname: ".handlebars",
    defaultLayout: false,
  }),
);

app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "resources", "views"));

// Cho phép đọc dữ liệu từ form
app.use(express.urlencoded({ extended: true }));

// Cho phép sử dụng CSS
app.use(express.static(path.join(__dirname, "public")));

// Chuyển trang mặc định đến trang đăng nhập
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Hiển thị trang login
app.get("/login", (req, res) => {
  res.render("login");
});

// Nhận dữ liệu đăng nhập
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("Email:", email);
  console.log("Mật khẩu:", password);

  res.send("Đăng nhập thành công!");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
