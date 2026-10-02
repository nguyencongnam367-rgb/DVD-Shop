<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const session = require("express-session");
=======
const express = require("express");
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
const path = require("path");
const { engine } = require("express-handlebars");

const route = require("./resources/Routers/index");

const db = require("./app/config");
<<<<<<< HEAD
db.connect();

const app = express();
const port = process.env.PORT || 3000;
=======

const app = express();
const port = 3000;
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

<<<<<<< HEAD
// Returns the first letter of the first non-empty argument (used for admin
// table avatar initials). Handlebars passes an extra options object as the
// last argument, so we filter that out.
const initial = (...args) => {
  const candidates = args.filter((arg) => typeof arg === "string" && arg.trim());
  const source = candidates[0] || "?";
  return source.trim().charAt(0).toUpperCase();
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);
// Expose login state to every view
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.year = new Date().getFullYear();
  next();
});
=======
app.use(express.urlencoded({ extended: true }));
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatVND: (value) => formatVND(value),
<<<<<<< HEAD
      initial,
      formatDate,
      gt: (a, b) => a > b,
      eq: (a, b) => a === b,
      mul: (a, b) => a * b,
=======
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
    },
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

route(app);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

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
