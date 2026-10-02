<<<<<<< HEAD
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

=======
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
class AuthController {
  showLogin(req, res) {
    res.render("login", { layout: "main" });
  }

<<<<<<< HEAD
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
=======
  login(req, res) {
    res.redirect("/");
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
  }

  showRegister(req, res) {
    res.render("register", { layout: "main" });
  }

<<<<<<< HEAD
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
=======
  register(req, res) {
    res.redirect("/auth/login");
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
  }
}

module.exports = new AuthController();
