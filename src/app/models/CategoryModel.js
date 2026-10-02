const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
=======
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true, collection: "categories" },
);

module.exports = mongoose.model("Category", categorySchema);
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
