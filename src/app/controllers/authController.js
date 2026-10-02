const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

class AuthController {
  showLogin(req, res) {
    res.render("login", { layout: "main" });
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Sai tên đăng nhập hoặc mật khẩu");
      }
      req.session.userId = user._id.toString();
      req.session.user = { username: user.username, role: user.role };
      return res.redirect(user.role === "admin" ? "/admin/dashboard" : "/");
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
