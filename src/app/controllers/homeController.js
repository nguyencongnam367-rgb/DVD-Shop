const Product = require("../models/ProductModel");

class HomeController {
  async index(req, res) {
    try {
      const products = await Product
        .find({ isActive: { $ne: false } })
        .sort({ viewCount: -1, soldCount: -1 })
        .lean();
      return res.render("layouts/home", {
        products,
        popularProducts: products.slice(0, 5),
        layout: "user/main",
      });
    } catch (error) {
      console.error("Không thể tải sản phẩm trang chủ:", error.message);
      return res.status(500).json({ error: "Không thể tải dữ liệu sản phẩm" });
    }
  }

  async show(req, res) {
    try {
      const product = await Product.findOne(
        { slug: req.params.slug, isActive: { $ne: false } },
        { _id: 1 },
      ).lean();

      if (!product) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }

      return res.redirect(`/product/${product._id}`);
    } catch (error) {
      console.error("Không thể tải chi tiết sản phẩm:", error.message);
      return res.status(500).json({ error: "Không thể tải dữ liệu sản phẩm" });
    }
  }
}

module.exports = new HomeController();
