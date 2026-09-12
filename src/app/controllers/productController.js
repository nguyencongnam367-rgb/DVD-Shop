class ProductController {
  index(req, res) {
    res.render("products", { products: [] });
  }

  show(req, res) {
    res.render("products_detail", { productId: req.params.id });
  }
}

module.exports = new ProductController();
