const products = require("../data/products");

class HomeController {
  index(req, res) {
    res.render("home", { products, layout: "main" });
  }
}

module.exports = new HomeController();
