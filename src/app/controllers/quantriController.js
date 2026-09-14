class QuanTriController {
  dashboard(req, res) {
    res.render("partials/QuanTri/home", { layout: "DashBoard" });
  }

  users(req, res) {
    res.render("partials/QuanTri/users", { layout: "DashBoard" });
  }

  products(req, res) {
    res.render("partials/QuanTri/products", { layout: "DashBoard" });
  }

  orders(req, res) {
    res.render("partials/QuanTri/orders", { layout: "DashBoard" });
  }
}

module.exports = new QuanTriController();
