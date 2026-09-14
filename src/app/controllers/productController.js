const products = require("../data/products");

class ProductController {
  index(req, res) {
    res.render("products", { products, layout: "main" });
  }

  show(req, res) {
    const product = products.find((item) => item._id === req.params.id);

    if (!product) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }

    return res.render("products_detail", { product, layout: "main" });
  }
}

module.exports = new ProductController();
