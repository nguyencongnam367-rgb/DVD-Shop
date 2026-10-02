const homeModel = require("../models/HomeModel");

class HomeController {
  async index(req, res) {
    try {
      const products = await homeModel
        .find({ isActive: { $ne: false } })
        .lean();
      return res.render("home", { products, layout: "main" });
    } catch (error) {
      console.error("Không thể tải sản phẩm trang chủ:", error.message);
      return res.status(500).json({ error: "Không thể tải dữ liệu sản phẩm" });
    }
  }

  async show(req, res) {
    try {
      const product = await homeModel.findOne({ slug: req.params.slug }).lean();

      if (!product) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }

      return res.render("products_detail", { product, layout: "main" });
    } catch (error) {
      console.error("Không thể tải chi tiết sản phẩm:", error.message);
      return res.status(500).json({ error: "Không thể tải dữ liệu sản phẩm" });
    }
  }
}

module.exports = new HomeController();
