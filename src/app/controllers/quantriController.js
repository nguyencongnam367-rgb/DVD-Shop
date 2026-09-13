class QuanTriController {
  dashboard(req, res) {
    res.render("home");
  }

  users(req, res) {
    res.render("users");
  }

  products(req, res) {
    res.render("products");
  }

  orders(req, res) {
    res.render("orders");
  }
}

module.exports = new QuanTriController();
