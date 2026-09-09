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

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("Email:", email);
  console.log("Mật khẩu:", password);

  res.send("Đăng nhập thành công!");
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  console.log("Tên đăng nhập:", username);
  console.log("Email:", email);
  console.log("Mật khẩu:", password);

  res.send("Đăng ký thành công!");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
