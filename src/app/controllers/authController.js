class AuthController {
  showLogin(req, res) {
    res.render("login", { layout: "main" });
  }

  login(req, res) {
    res.redirect("/");
  }

  showRegister(req, res) {
    res.render("register", { layout: "main" });
  }

  register(req, res) {
    res.redirect("/auth/login");
  }
}

module.exports = new AuthController();
