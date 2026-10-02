<<<<<<< HEAD
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

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
=======
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
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
  }
}

module.exports = new QuanTriController();
