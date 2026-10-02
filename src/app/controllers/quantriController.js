const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Category = require("../models/CategoryModel");

function productInput(body) {
  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  const price = Number(body.price);
  const stock =
    body.stock === "" || body.stock === undefined ? 0 : Number(body.stock);
  const discountPrice =
    body.discountPrice === "" || body.discountPrice === undefined
      ? undefined
      : Number(body.discountPrice);
  const releaseYear = body.releaseYear ? Number(body.releaseYear) : undefined;
  const duration = body.duration ? Number(body.duration) : undefined;

  if (!name || !slug)
    throw new Error("Vui lòng nhập tên và đường dẫn sản phẩm.");
  if (!Number.isFinite(price) || price < 0)
    throw new Error("Giá sản phẩm không hợp lệ.");
  if (!Number.isInteger(stock) || stock < 0)
    throw new Error("Tồn kho phải là số nguyên không âm.");
  if (
    discountPrice !== undefined &&
    (!Number.isFinite(discountPrice) ||
      discountPrice < 0 ||
      discountPrice > price)
  ) {
    throw new Error("Giá khuyến mãi phải nằm trong khoảng từ 0 đến giá gốc.");
  }
  if (releaseYear !== undefined && !Number.isInteger(releaseYear))
    throw new Error("Năm phát hành không hợp lệ.");
  if (duration !== undefined && (!Number.isInteger(duration) || duration < 0))
    throw new Error("Thời lượng không hợp lệ.");
  if (body.categoryId && !mongoose.isValidObjectId(body.categoryId)) {
    throw new Error("Thể loại không hợp lệ.");
  }

  return {
    name,
    slug,
    categoryId: body.categoryId || undefined,
    director: String(body.director || "").trim(),
    releaseYear,
    duration,
    language: String(body.language || "").trim(),
    price,
    discountPrice,
    stock,
    image: String(body.image || "").trim(),
    description: String(body.description || "").trim(),
    isFeatured: body.isFeatured === "on",
    isActive: body.isActive === "on",
  };
}

async function renderProductForm(
  res,
  product,
  isUpgrade,
  error = "",
  status = 200,
) {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const formProduct = {
    name: "",
    slug: "",
    director: "",
    releaseYear: "",
    duration: "",
    language: "",
    price: "",
    discountPrice: "",
    stock: 0,
    image: "",
    description: "",
    isFeatured: false,
    isActive: true,
    ...product,
    categoryId: product.categoryId ? String(product.categoryId) : "",
  };

  return res
    .status(status)
    .render(`partials/QuanTri/${isUpgrade ? "upgrade" : "add"}`, {
      layout: "DashBoard",
      product: formProduct,
      categories: categories.map((category) => ({
        ...category,
        _id: String(category._id),
      })),
      error,
      adminProductPageCss: `admin-product-${isUpgrade ? "upgrade" : "add"}`,
    });
}

class QuanTriController {
  async dashboard(req, res) {
    try {
      const [topProducts, totalOrders, totalUsers] = await Promise.all([
        Product.find().sort({ soldCount: -1 }).limit(5).lean(),
        Order.countDocuments(),
        User.countDocuments(),
      ]);

      return res.render("partials/QuanTri/home", {
        layout: "DashBoard",
        topProducts,
        totalOrders,
        totalUsers,
      });
    } catch (error) {
      console.error("Không thể tải dashboard:", error.message);
      return res.status(500).send("Không thể tải dashboard");
    }
  }

  async users(req, res) {
    try {
      const users = await User.find().lean();
      return res.render("partials/QuanTri/users", {
        layout: "DashBoard",
        users,
      });
    } catch (error) {
      console.error("Không thể tải danh sách khách hàng:", error.message);
      return res.status(500).send("Không thể tải danh sách khách hàng");
    }
  }

  async products(req, res) {
    try {
      const products = await Product.find().populate("categoryId").lean();
      return res.render("partials/QuanTri/products", {
        layout: "DashBoard",
        products,
      });
    } catch (error) {
      console.error("Không thể tải danh sách DVD:", error.message);
      return res.status(500).send("Không thể tải danh sách DVD");
    }
  }

  async addProduct(req, res) {
    try {
      return await renderProductForm(res, {}, false);
    } catch (error) {
      console.error("Không thể tải form sản phẩm:", error.message);
      return res.status(500).send("Không thể tải form sản phẩm");
    }
  }

  async createProduct(req, res) {
    try {
      const data = productInput(req.body);
      if (
        data.categoryId &&
        !(await Category.exists({ _id: data.categoryId }))
      ) {
        throw new Error("Không tìm thấy thể loại đã chọn.");
      }
      await Product.create(data);
      return res.redirect("/admin/products");
    } catch (error) {
      if (error.code === 11000) {
        return renderProductForm(
          res,
          req.body,
          false,
          "Đường dẫn sản phẩm đã tồn tại.",
          409,
        );
      }
      if (error.name === "Error" && !error.code) {
        return renderProductForm(res, req.body, false, error.message, 400);
      }
      console.error("Không thể thêm sản phẩm:", error.message);
      return res.status(500).send("Không thể thêm sản phẩm");
    }
  }

  async upgradeProduct(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }
      const product = await Product.findById(req.params.id).lean();
      if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
      return await renderProductForm(res, product, true);
    } catch (error) {
      console.error("Không thể tải sản phẩm:", error.message);
      return res.status(500).send("Không thể tải sản phẩm");
    }
  }

  async updateProduct(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }
      const data = productInput(req.body);
      if (
        data.categoryId &&
        !(await Category.exists({ _id: data.categoryId }))
      ) {
        throw new Error("Không tìm thấy thể loại đã chọn.");
      }
      const product = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      }).lean();
      if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
      return res.redirect("/admin/products");
    } catch (error) {
      if (error.code === 11000) {
        return renderProductForm(
          res,
          { ...req.body, _id: req.params.id },
          true,
          "Đường dẫn sản phẩm đã tồn tại.",
          409,
        );
      }
      if (error.name === "Error" && !error.code) {
        return renderProductForm(
          res,
          { ...req.body, _id: req.params.id },
          true,
          error.message,
          400,
        );
      }
      console.error("Không thể cập nhật sản phẩm:", error.message);
      return res.status(500).send("Không thể cập nhật sản phẩm");
    }
  }

  async orders(req, res) {
    try {
      const orders = await Order.find()
        .populate("userId")
        .sort({ createdAt: -1 })
        .lean();
      return res.render("partials/QuanTri/orders", {
        layout: "DashBoard",
        orders,
      });
    } catch (error) {
      console.error("Không thể tải danh sách đơn hàng:", error.message);
      return res.status(500).send("Không thể tải danh sách đơn hàng");
    }
  }
}

module.exports = new QuanTriController();
