const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
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

async function getReportStats() {
  const now = new Date();
  const monthStarts = Array.from({ length: 6 }, (_, index) =>
    new Date(now.getFullYear(), now.getMonth() - 5 + index, 1),
  );
  const firstMonth = monthStarts[0];
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [revenueOrders, inventory, productTypes, orderCount, monthlyTotals] =
    await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "Đã huỷ" } } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $convert: {
                  input: "$totalAmount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $convert: {
                  input: "$stock",
                  to: "int",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]),
      Product.countDocuments(),
      Order.countDocuments({ status: { $ne: "Đã huỷ" } }),
      Order.aggregate([
        {
          $match: {
            status: { $ne: "Đã huỷ" },
            createdAt: { $gte: firstMonth, $lt: nextMonth },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: {
              $sum: {
                $convert: {
                  input: "$totalAmount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]),
    ]);

  const totalsByMonth = new Map(
    monthlyTotals.map(({ _id, total }) => [
      `${_id.year}-${_id.month}`,
      total,
    ]),
  );
  const monthlyRevenue = monthStarts.map((start) => ({
    label: new Intl.DateTimeFormat("vi-VN", { month: "short" }).format(start),
    total:
      totalsByMonth.get(`${start.getFullYear()}-${start.getMonth() + 1}`) || 0,
  }));
  const maxMonthlyRevenue = Math.max(
    0,
    ...monthlyRevenue.map((month) => month.total),
  );

  return {
    totalRevenue: revenueOrders[0] ? revenueOrders[0].total : 0,
    totalProductQuantity: inventory[0] ? inventory[0].total : 0,
    totalProductTypes: productTypes,
    totalReportOrders: orderCount,
    monthlyRevenue: monthlyRevenue.map((month) => ({
      ...month,
      barHeight:
        maxMonthlyRevenue > 0
          ? Math.max(4, Math.round((month.total / maxMonthlyRevenue) * 100))
          : 4,
    })),
  };
}

class QuanTriController {
  async dashboard(req, res) {
    try {
      const [topProducts, totalOrders, totalUsers, reportStats] =
        await Promise.all([
          Product.find().sort({ soldCount: -1 }).limit(5).lean(),
          Order.countDocuments(),
          User.countDocuments(),
          getReportStats(),
        ]);

      return res.render("partials/QuanTri/home", {
        layout: "DashBoard",
        topProducts,
        totalOrders,
        totalUsers,
        ...reportStats,
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

  async deleteProduct(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }

      const product = await Product.findByIdAndDelete(req.params.id).lean();
      if (!product) return res.status(404).send("Không tìm thấy sản phẩm");

      await Cart.updateMany(
        { "items.productId": product._id },
        { $pull: { items: { productId: product._id } } },
      );

      return res.redirect("/admin/products");
    } catch (error) {
      console.error("Không thể xóa sản phẩm:", error.message);
      return res.status(500).send("Không thể xóa sản phẩm");
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
        orderNotice:
          req.query.result === "approved"
            ? "Đã xác nhận đơn hàng và chuyển sang trạng thái đang giao."
            : req.query.result === "rejected"
              ? "Đã từ chối đơn hàng và hoàn lại tồn kho."
              : req.query.result === "updated"
                ? "Trạng thái đơn hàng đã được cập nhật."
                : req.query.result === "already-processed"
                  ? "Đơn hàng đã được xử lý trước đó."
                  : "",
      });
    } catch (error) {
      console.error("Không thể tải danh sách đơn hàng:", error.message);
      return res.status(500).send("Không thể tải danh sách đơn hàng");
    }
  }

  async approveOrder(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Không tìm thấy đơn hàng");
      }

      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, status: "Chờ xử lý" },
        { $set: { status: "Đang giao" } },
        { returnDocument: "after" },
      );
      if (!order) {
        return res.redirect("/admin/orders?result=already-processed");
      }

      return res.redirect("/admin/orders?result=approved");
    } catch (error) {
      console.error("Không thể xác nhận đơn hàng:", error.message);
      return res.status(500).send("Không thể xác nhận đơn hàng");
    }
  }

  async rejectOrder(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Không tìm thấy đơn hàng");
      }

      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, status: "Chờ xử lý" },
        { $set: { status: "Đã huỷ" } },
        { returnDocument: "after" },
      );
      if (!order) {
        return res.redirect("/admin/orders?result=already-processed");
      }

      if (order.inventoryReserved) {
        try {
          for (const item of order.items) {
            const restored = await Product.updateOne(
              { _id: item.productId },
              {
                $inc: {
                  stock: item.quantity,
                  soldCount: -item.quantity,
                },
              },
            );
            if (restored.matchedCount === 0) {
              console.warn(
                `Không thể hoàn kho cho sản phẩm đã bị xóa: ${item.productId} (đơn ${order.orderCode})`,
              );
            }
          }
          await Order.updateOne(
            { _id: order._id, status: "Đã huỷ" },
            { $set: { inventoryReserved: false } },
          );
        } catch (inventoryError) {
          console.error(
            `Đơn ${order.orderCode} đã bị từ chối nhưng chưa hoàn kho đầy đủ:`,
            inventoryError.message,
          );
          return res
            .status(500)
            .send("Đơn hàng đã bị từ chối nhưng không thể hoàn kho đầy đủ. Vui lòng kiểm tra tồn kho.");
        }
      }

      return res.redirect("/admin/orders?result=rejected");
    } catch (error) {
      console.error("Không thể từ chối đơn hàng:", error.message);
      return res.status(500).send("Không thể từ chối đơn hàng");
    }
  }

  async reports(req, res) {
    try {
      const reportStats = await getReportStats();
      return res.render("partials/QuanTri/reports", {
        layout: "DashBoard",
        adminReportPage: true,
        ...reportStats,
      });
    } catch (error) {
      console.error("Không thể tải báo cáo:", error.message);
      return res.status(500).send("Không thể tải báo cáo");
    }
  }
}

module.exports = new QuanTriController();
