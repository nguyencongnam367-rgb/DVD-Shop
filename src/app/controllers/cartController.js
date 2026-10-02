<<<<<<< HEAD
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

class CartController {
  async index(req, res) {
    try {
      const userId = req.session && req.session.userId;

      const cart = userId
        ? await Cart.findOne({ userId }).lean()
        : null;

      const cartItems = (cart && cart.items) || [];
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shipping = subtotal > 0 ? 30000 : 0;
      const discount = 0;
      const total = subtotal + shipping - discount;

      return res.render("partials/Cart/cart", {
        cartItems,
        subtotal,
        shipping,
        discount,
        total,
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
          price: product.price,
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
=======
class CartController {
  index(req, res) {
    const cartItems = [
      {
        _id: "1",
        title: "Dune: Part Two",
        type: "DVD • Bản đầy đủ",
        price: 220000,
        quantity: 1,
        color: "linear-gradient(135deg, #dbeafe, #bfdbfe)"
      },
      {
        _id: "2",
        title: "Spider-Man: Across the Spider-Verse",
        type: "DVD • Phim hoạt hình",
        price: 240000,
        quantity: 1,
        color: "linear-gradient(135deg, #fef1d8, #ffd39d)"
      }
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 30000;
    const discount = 50000;
    const total = subtotal + shipping - discount;

    res.render("partials/Cart/cart", {
      cartItems,
      subtotal,
      shipping,
      discount,
      total,
    });
  }

  add(req, res) {
    res.redirect("/cart");
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
  }
}

module.exports = new CartController();
