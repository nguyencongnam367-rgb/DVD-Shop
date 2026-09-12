class CartController {
  index(req, res) {
    res.render("cart", { cart: [] });
  }

  add(req, res) {
    res.redirect("/cart");
  }
}

module.exports = new CartController();
