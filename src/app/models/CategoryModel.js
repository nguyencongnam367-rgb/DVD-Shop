const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true, collection: "categories" },
);

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
