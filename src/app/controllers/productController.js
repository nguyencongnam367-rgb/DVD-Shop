const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");

const SORTS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  name: { name: 1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ProductController {
  async index(req, res) {
    try {
      const q = (req.query.q || "").trim();
      const cat = req.query.cat || "";
      const sort = SORTS[req.query.sort] ? req.query.sort : "newest";

      const filter = { isActive: { $ne: false } };
      if (q) filter.name = { $regex: escapeRegex(q), $options: "i" };
      if (/^[a-f\d]{24}$/i.test(cat)) filter.categoryId = cat;

      const [products, categories] = await Promise.all([
        Product.find(filter).sort(SORTS[sort]).lean(),
        Category.find().sort({ name: 1 }).lean(),
      ]);

      const cats = categories.map((c) => ({ ...c, active: String(c._id) === cat }));

      return res.render("partials/Product-form/products", {
        products,
        categories: cats,
        total: products.length,
        q,
        cat,
        sort,
        sortOptions: [
          { value: "newest", label: "Mới nhất", selected: sort === "newest" },
          { value: "price-asc", label: "Giá tăng dần", selected: sort === "price-asc" },
          { value: "price-desc", label: "Giá giảm dần", selected: sort === "price-desc" },
          { value: "name", label: "Tên A → Z", selected: sort === "name" },
        ],
        allActive: !cat,
        layout: "user/main",
      });
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm:", error.message);
      return res.status(500).send("Không thể tải dữ liệu sản phẩm");
    }
  }

  async show(req, res) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, isActive: { $ne: false } },
        { $inc: { viewCount: 1 } },
        { new: true },
      )
        .populate("categoryId")
        .lean();
      if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
      return res.render("partials/Product-form/products_detail", {
        product,
        layout: "user/main",
      });
    } catch (error) {
      console.error("Không thể tải chi tiết sản phẩm:", error.message);
      return res.status(500).send("Không thể tải dữ liệu sản phẩm");
    }
  }
}

module.exports = new ProductController();
