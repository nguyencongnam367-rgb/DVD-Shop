class AdminController {
  dashboard(req, res) {
    res.render("admin/dashboard");
  }

  products(req, res) {
    res.render("admin/products", { products: [] });
  }

  showAddProduct(req, res) {
    res.render("admin/add-product");
  }

  showEditProduct(req, res) {
    res.render("admin/edit-product", { productId: req.params.id });
  }
}

module.exports = new AdminController();
