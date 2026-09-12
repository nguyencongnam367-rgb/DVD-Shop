class HomeController {
  index(req, res) {
    res.render("home", { products: [] });
  }
}

module.exports = new HomeController();
