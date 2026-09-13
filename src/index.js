const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { engine } = require("express-handlebars");

<<<<<<< HEAD
const app = express();
const PORT = 3000;

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

const products = [
  {
    _id: "1",
    name: "The Dark Knight",
    director: "Christopher Nolan",
    price: 499000,
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "2",
    name: "Inception",
    director: "Christopher Nolan",
    price: 529000,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "3",
    name: "Interstellar",
    director: "Christopher Nolan",
    price: 599000,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "4",
    name: "Dune",
    director: "Denis Villeneuve",
    price: 569000,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "5",
    name: "Blade Runner 2049",
    director: "Denis Villeneuve",
    price: 459000,
    image:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "6",
    name: "The Matrix",
    director: "Lana Wachowski",
    price: 439000,
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80",
  },
];

// Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: false,
    helpers: {
      formatVND: (value) => formatVND(value),
    },
  }),
);

app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "resources", "views"));

app.use(express.urlencoded({ extended: true }));
=======
const route = require("./resources/Routers/index");
>>>>>>> be132bbdf8c6f30e80b2152c6a6defa739258988

app.use(express.static(path.join(__dirname, "public")));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/home", (req, res) => {
  res.render("home", { products });
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
=======
route(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
>>>>>>> be132bbdf8c6f30e80b2152c6a6defa739258988
});
