const crypto = require("crypto");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const SHIPPING_FEE = 30000;

function checkoutViewData(user, cart, products, form = {}) {
  const productsById = new Map(products.map((product) => [String(product._id), product]));
  const cartItems = cart.items.map((item) => {
    const product = productsById.get(String(item.productId));
    const quantity = Number(item.quantity);
    const available =
      Boolean(product) &&
      product.isActive !== false &&
      Number.isInteger(quantity) &&
      quantity > 0 &&
      Number(product.stock) >= quantity;
    const price = product
      ? Number(product.discountPrice) > 0
        ? Number(product.discountPrice)
        : Number(product.price)
      : Number(item.price);

    return {
      name: product?.name || item.name,
      image: product?.image || item.image,
      quantity,
      price,
      lineTotal: price * quantity,
      available,
    };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;

  return {
    cartItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
    canCheckout: cartItems.length > 0 && cartItems.every((item) => item.available),
    receiverName: form.receiverName ?? user.fullName ?? user.username,
    receiverPhone: form.receiverPhone ?? user.phone ?? "",
    shippingAddress: form.shippingAddress ?? user.address ?? "",
  };
}

async function renderCheckout(res, userId, form = {}, error = null, status = 200) {
  const [user, cart] = await Promise.all([
    User.findById(userId).lean(),
    Cart.findOne({ userId }).lean(),
  ]);

  if (!user || user.isActive === false) {
    return res.redirect("/auth/logout");
  }
  if (!cart || !cart.items.length) {
    return res.redirect("/cart");
  }

  const products = await Product.find({
    _id: { $in: cart.items.map((item) => item.productId) },
  }).lean();

  return res.status(status).render("partials/Cart/checkout", {
    ...checkoutViewData(user, cart, products, form),
    error,
  });
}

async function restoreReservedProducts(reservedItems) {
  while (reservedItems.length) {
    const item = reservedItems[reservedItems.length - 1];
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity, soldCount: -item.quantity } },
    );
    reservedItems.pop();
  }
}

class CartController {
  async index(req, res) {
    try {
      const userId = req.session && req.session.userId;

      const cart = userId
        ? await Cart.findOne({ userId }).lean()
        : null;

      const storedItems = (cart && cart.items) || [];
      const products = storedItems.length
        ? await Product.find({
            _id: { $in: storedItems.map((item) => item.productId) },
          }).lean()
        : [];
      const productsById = new Map(products.map((product) => [String(product._id), product]));
      const cartItems = storedItems.map((item) => {
        const product = productsById.get(String(item.productId));
        const price = product
          ? Number(product.discountPrice) > 0
            ? Number(product.discountPrice)
            : Number(product.price)
          : Number(item.price);

        return {
          ...item,
          name: product?.name || item.name,
          image: product?.image || item.image,
          price,
          available:
            Boolean(product) &&
            product.isActive !== false &&
            Number(product.stock) >= Number(item.quantity),
        };
      });
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
      const discount = 0;
      const total = subtotal + shipping - discount;

      return res.render("partials/Cart/cart", {
        cartItems,
        subtotal,
        shipping,
        discount,
        total,
        canCheckout: cartItems.length > 0 && cartItems.every((item) => item.available),
        loginRequired: !userId,
        notice: req.query.notice === "empty" ? "Giỏ hàng hiện không có sản phẩm để thanh toán." : "",
      });
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error.message);
      return res.status(500).send("Không thể tải giỏ hàng");
    }
  }

  async add(req, res) {
    try {
      const userId = req.session && req.session.userId;

      if (!userId) {
        return res.redirect("/auth/login");
      }

      const { productId, quantity } = req.body;
      const qty = Number(quantity) || 1;

      const product = await Product.findById(productId).lean();
      if (!product) {
        return res.redirect("/cart");
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price:
            Number(product.discountPrice) > 0
              ? Number(product.discountPrice)
              : Number(product.price),
          image: product.image,
          quantity: qty,
        });
      }

      await cart.save();
      return res.redirect("/cart");
    } catch (error) {
      console.error("Không thể thêm vào giỏ hàng:", error.message);
      return res.status(500).send("Không thể thêm vào giỏ hàng");
    }
  }

    async checkout(req, res) {
      try {
        const userId = req.session && req.session.userId;
        if (!userId) {
          req.session.returnTo = "/cart/checkout";
          return res.redirect("/auth/login");
        }
        return await renderCheckout(res, userId);
      } catch (error) {
        console.error("Không thể tải trang thanh toán:", error.message);
        return res.status(500).send("Không thể tải trang thanh toán");
      }
    }

    async placeOrder(req, res) {
      const userId = req.session && req.session.userId;
      if (!userId) return res.redirect("/auth/login");

      const form = {
        receiverName:
          typeof req.body.receiverName === "string" ? req.body.receiverName.trim() : "",
        receiverPhone:
          typeof req.body.receiverPhone === "string" ? req.body.receiverPhone.trim() : "",
        shippingAddress:
          typeof req.body.shippingAddress === "string" ? req.body.shippingAddress.trim() : "",
      };
      const phoneDigits = form.receiverPhone.replace(/\D/g, "");
      if (
        !form.receiverName ||
        form.receiverName.length > 120 ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15 ||
        !/^\+?[0-9][0-9\s().-]{6,18}$/.test(form.receiverPhone) ||
        !form.shippingAddress ||
        form.shippingAddress.length > 500
      ) {
        try {
          return await renderCheckout(
            res,
            userId,
            form,
            "Vui lòng kiểm tra họ tên, số điện thoại và địa chỉ giao hàng.",
            400,
          );
        } catch (error) {
          console.error("Không thể xác thực thông tin thanh toán:", error.message);
          return res.status(500).send("Không thể xác thực thông tin thanh toán");
        }
      }

      const reservedItems = [];
      let createdOrder;
      try {
        const [user, cart] = await Promise.all([
          User.findById(userId).lean(),
          Cart.findOne({ userId }).lean(),
        ]);
        if (!user || user.isActive === false) return res.redirect("/auth/logout");
        if (!cart || !cart.items.length) {
          return res.redirect("/cart?notice=empty");
        }

        const products = await Product.find({
          _id: { $in: cart.items.map((item) => item.productId) },
          isActive: { $ne: false },
        }).lean();
        const productsById = new Map(products.map((product) => [String(product._id), product]));
        const orderItems = [];

        for (const item of cart.items) {
          const product = productsById.get(String(item.productId));
          const quantity = Number(item.quantity);
          if (
            !product ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            Number(product.stock) < quantity
          ) {
            return await renderCheckout(
              res,
              userId,
              form,
              "Một hoặc nhiều sản phẩm đã hết hàng hoặc không còn đủ số lượng. Vui lòng kiểm tra lại giỏ hàng.",
              409,
            );
          }

          const price =
            Number(product.discountPrice) > 0
              ? Number(product.discountPrice)
              : Number(product.price);
          orderItems.push({
            productId: product._id,
            name: product.name,
            price,
            quantity,
            subTotal: price * quantity,
          });
        }

        const subtotal = orderItems.reduce((sum, item) => sum + item.subTotal, 0);
        const shipping = subtotal > 0 ? SHIPPING_FEE : 0;

        for (const item of orderItems) {
          const reserved = await Product.findOneAndUpdate(
            {
              _id: item.productId,
              isActive: { $ne: false },
              stock: { $gte: item.quantity },
            },
            {
              $inc: { stock: -item.quantity, soldCount: item.quantity },
            },
            { returnDocument: "after" },
          );
          if (!reserved) {
            await restoreReservedProducts(reservedItems);
            return await renderCheckout(
              res,
              userId,
              form,
              "Số lượng tồn kho vừa thay đổi. Vui lòng kiểm tra lại đơn hàng.",
              409,
            );
          }
          reservedItems.push(item);
        }

        createdOrder = await Order.create({
          orderCode: `DVD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          userId,
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          shippingAddress: form.shippingAddress,
          paymentMethod: "COD",
          totalAmount: subtotal + shipping,
          inventoryReserved: true,
          items: orderItems,
        });

        const deletedCart = await Cart.deleteOne({ _id: cart._id, userId });
        if (deletedCart.deletedCount !== 1) {
          throw new Error("Giỏ hàng đã thay đổi trong lúc tạo đơn.");
        }

        return res.redirect(`/cart/orders/${createdOrder.orderCode}`);
      } catch (error) {
        if (createdOrder) {
          try {
            await Order.deleteOne({ _id: createdOrder._id });
          } catch (rollbackError) {
            console.error("Không thể hoàn tác đơn hàng:", rollbackError.message);
          }
        }
        while (reservedItems.length) {
          const item = reservedItems[reservedItems.length - 1];
          try {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: item.quantity, soldCount: -item.quantity } },
            );
            reservedItems.pop();
          } catch (rollbackError) {
            console.error(
              `Không thể hoàn kho sản phẩm ${item.productId}:`,
              rollbackError.message,
            );
            break;
          }
        }
        console.error("Không thể tạo đơn hàng:", error.message);
        return res.status(500).send("Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    }

    async orderSuccess(req, res) {
      try {
        const userId = req.session && req.session.userId;
        if (!userId) return res.redirect("/auth/login");

        const order = await Order.findOne({
          orderCode: req.params.orderCode,
          userId,
        }).lean();
        if (!order) return res.status(404).send("Không tìm thấy đơn hàng");

        return res.render("partials/Cart/order-success", { order });
      } catch (error) {
        console.error("Không thể tải xác nhận đơn hàng:", error.message);
        return res.status(500).send("Không thể tải xác nhận đơn hàng");
      }
    }

    async orderHistory(req, res) {
      try {
        const userId = req.session && req.session.userId;
        if (!userId) return res.redirect("/auth/login");

        const orders = await Order.find({ userId, status: { $ne: "Đã huỷ" } })
          .sort({ createdAt: -1 })
          .lean();
        const history = orders.map((order) => ({
          ...order,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          statusLabel:
            order.status === "Đã huỷ"
              ? "Đã hủy"
              : order.status === "Hoàn thành"
                ? "Hoàn thành"
                : order.status === "Đang giao"
                  ? "Đang giao"
                  : "Chờ xử lý",
          statusClass:
            order.status === "Hoàn thành"
              ? "complete"
              : order.status === "Đã huỷ"
                ? "cancelled"
                : order.status === "Đang giao"
                  ? "shipping"
                  : "pending",
          paymentLabel:
            order.paymentMethod === "Chuyển khoản"
              ? "Chuyển khoản"
              : "Thanh toán khi nhận hàng",
        }));

        return res.render("partials/Cart/order-history", {
          orders: history,
          orderCount: history.length,
        });
      } catch (error) {
        console.error("Không thể tải lịch sử mua hàng:", error.message);
        return res.status(500).send("Không thể tải lịch sử mua hàng");
      }
    }

    async cancelOrder(req, res) {
      try {
        const userId = req.session && req.session.userId;
        const wantsJson = req.get("X-Requested-With") === "XMLHttpRequest";
        if (!userId) {
          if (wantsJson) {
            return res.status(401).json({ message: "Vui lòng đăng nhập lại." });
          }
          return res.redirect("/auth/login");
        }

        let order = await Order.findOneAndUpdate(
          {
            orderCode: req.params.orderCode,
            userId,
            status: { $ne: "Đã huỷ" },
          },
          { $set: { status: "Đã huỷ" } },
          { returnDocument: "after" },
        );
        if (!order) {
          order = await Order.findOne({
            orderCode: req.params.orderCode,
            userId,
          });
          if (!order || order.status !== "Đã huỷ") {
            if (wantsJson) {
              return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
            }
            return res.status(404).send("Không tìm thấy đơn hàng");
          }
        }

        if (order.inventoryReserved) {
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
          const reservationUpdated = await Order.updateOne(
            { _id: order._id, status: "Đã huỷ" },
            { $set: { inventoryReserved: false } },
          );
          if (reservationUpdated.matchedCount !== 1) {
            throw new Error(`Không thể cập nhật tồn kho đơn ${order.orderCode}.`);
          }
        }

        const deletedOrder = await Order.deleteOne({ _id: order._id, userId });
        if (deletedOrder.deletedCount !== 1) {
          throw new Error(`Không thể xóa đơn hàng ${order.orderCode}.`);
        }

        if (wantsJson) {
          return res.json({ success: true });
        }
        return res.redirect("/cart/orders?result=cancelled");
      } catch (error) {
        console.error("Không thể hủy đơn hàng:", error.message);
        if (req.get("X-Requested-With") === "XMLHttpRequest") {
          return res.status(500).json({ message: "Không thể hủy đơn hàng" });
        }
        return res.status(500).send("Không thể hủy đơn hàng");
      }
    }
  }

module.exports = new CartController();
