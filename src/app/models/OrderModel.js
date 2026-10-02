const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    shippingAddress: { type: String, required: true, trim: true },
    paymentMethod: { type: String, enum: ["COD", "Chuyển khoản"], default: "COD" },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Chờ xử lý", "Đang giao", "Hoàn thành", "Đã huỷ"], default: "Chờ xử lý" },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  },
  { timestamps: true, collection: "orders" },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
