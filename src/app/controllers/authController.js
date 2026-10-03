const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

class AuthController {
  showLogin(req, res) {
    res.render("login", { layout: "main" });
  }

  async login(req, res) {
    try {
      const identifier =
        typeof req.body.username === "string" ? req.body.username.trim() : "";
      const password =
        typeof req.body.password === "string" ? req.body.password : "";

      if (!identifier || !password) {
        return res.status(401).render("login", {
          layout: "main",
          error: "Vui lòng nhập tên đăng nhập và mật khẩu.",
          username: identifier,
        });
      }

      const user = await User.findOne({
        $or: [
          { username: identifier },
          { email: identifier.toLowerCase() },
        ],
      });
      if (
        !user ||
        user.isActive === false ||
        !(await bcrypt.compare(password, user.password))
      ) {
        return res.status(401).render("login", {
          layout: "main",
          error: "Tên đăng nhập hoặc mật khẩu không chính xác.",
          username: identifier,
        });
      }
      req.session.userId = user._id.toString();
      req.session.user = { username: user.username, role: user.role };
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      return res.redirect(
        user.role === "admin"
          ? "/admin/dashboard"
          : returnTo === "/cart/checkout"
            ? returnTo
            : "/",
      );
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
      return res.status(500).send("Lỗi hệ thống");
    }
  }

  showRegister(req, res) {
    res.render("register", { layout: "main" });
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const exists = await User.findOne({ $or: [{ username }, { email }] });
      if (exists) return res.status(409).send("Tên đăng nhập hoặc email đã tồn tại");
      const hash = await bcrypt.hash(password, 10);
      await User.create({ username, email, password: hash });
      return res.redirect("/auth/login");
    } catch (error) {
      console.error("Lỗi đăng ký:", error.message);
      return res.status(500).send("Lỗi hệ thống");
    }
  }

  logout(req, res) {
    req.session.destroy(() => res.redirect("/"));
  }
}

module.exports = new AuthController();
