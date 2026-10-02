const mongoose = require("mongoose");

<<<<<<< HEAD
const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverName: { type: String, default: "" },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, default: "Chờ xác nhận" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
=======
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (items) => items.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    shippingAddress: { type: String, required: true, trim: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "Chuyển khoản"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đang giao", "Hoàn thành", "Đã huỷ"],
      default: "Chờ xử lý",
    },
  },
  { timestamps: true, collection: "orders" },
);

module.exports = mongoose.model("Order", orderSchema);
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
