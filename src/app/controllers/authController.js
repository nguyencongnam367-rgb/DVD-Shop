class AuthController {
  showLogin(req, res) {
    res.render("login");
  }

  login(req, res) {
    res.redirect("/");
  }

  showRegister(req, res) {
    res.render("register");
  }

  register(req, res) {
    res.redirect("/auth/login");
  }
}

module.exports = new AuthController();
