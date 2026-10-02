require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./app/models/UserModel");
const Category = require("./app/models/CategoryModel");
const Product = require("./app/models/ProductModel");
<<<<<<< HEAD
const bcryptHashPattern = /^\$2[aby]\$\d{2}\$/;

(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/dvdshop",
  );

  await User.updateOne(
    { username: "admin" },
    {
      $setOnInsert: {
        username: "admin",
        email: "admin@dvdshop.vn",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
        fullName: "Administrator",
      },
    },
    { upsert: true },
  );

  const users = await User.find({}, { password: 1 }).lean();
  for (const user of users) {
    if (
      typeof user.password !== "string" ||
      bcryptHashPattern.test(user.password)
    ) {
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    await User.updateOne(
      { _id: user._id, password: user.password },
      { $set: { password: passwordHash } },
    );
  }

  const cats = {};
  for (const [name, slug] of [
    ["Hành động", "hanh-dong"],
    ["Hoạt hình", "hoat-hinh"],
    ["Khoa học viễn tưởng", "khoa-hoc-vien-tuong"],
  ]) {
    const c = await Category.findOneAndUpdate(
      { slug },
      { name, slug },
      { upsert: true, new: true },
    );
    cats[slug] = c._id;
  }

  const img = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
  const items = [
    [
      "Dune: Part Two",
      "dune-part-two",
      "khoa-hoc-vien-tuong",
      "Denis Villeneuve",
      220000,
      "photo-1517604931442-7e0c8ed2963c",
      245,
    ],
    [
      "Spider-Man: Across the Spider-Verse",
      "spider-verse",
      "hoat-hinh",
      "Joaquim Dos Santos",
      240000,
      "photo-1536440136628-849c177e76a1",
      112,
    ],
    [
      "Your Name",
      "your-name",
      "hoat-hinh",
      "Makoto Shinkai",
      180000,
      "photo-1489599849927-2ee91cede3ba",
      19,
    ],
    [
      "The Dark Knight",
      "the-dark-knight",
      "hanh-dong",
      "Christopher Nolan",
      260000,
      "photo-1504384308090-c894fdcc538d",
      80,
    ],
    [
      "Inception",
      "inception",
      "khoa-hoc-vien-tuong",
      "Christopher Nolan",
      230000,
      "photo-1516280440614-37939bbacd81",
      60,
    ],
    [
      "The Matrix",
      "the-matrix",
      "khoa-hoc-vien-tuong",
      "Lana Wachowski",
      210000,
      "photo-1524989941526-3c94f5d0e211",
      50,
    ],
=======

(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/dvdshop");

  await User.updateOne(
    { username: "admin" },
    { $setOnInsert: { username: "admin", email: "admin@dvdshop.vn", password: await bcrypt.hash("admin123", 10), role: "admin", fullName: "Administrator" } },
    { upsert: true },
  );

  const cats = {};
  for (const [name, slug] of [["Hành động", "hanh-dong"], ["Hoạt hình", "hoat-hinh"], ["Khoa học viễn tưởng", "khoa-hoc-vien-tuong"]]) {
    const c = await Category.findOneAndUpdate({ slug }, { name, slug }, { upsert: true, new: true });
    cats[slug] = c._id;
  }

  const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
  const items = [
    ["Dune: Part Two", "dune-part-two", "khoa-hoc-vien-tuong", "Denis Villeneuve", 220000, "photo-1517604931442-7e0c8ed2963c", 245],
    ["Spider-Man: Across the Spider-Verse", "spider-verse", "hoat-hinh", "Joaquim Dos Santos", 240000, "photo-1536440136628-849c177e76a1", 112],
    ["Your Name", "your-name", "hoat-hinh", "Makoto Shinkai", 180000, "photo-1489599849927-2ee91cede3ba", 19],
    ["The Dark Knight", "the-dark-knight", "hanh-dong", "Christopher Nolan", 260000, "photo-1504384308090-c894fdcc538d", 80],
    ["Inception", "inception", "khoa-hoc-vien-tuong", "Christopher Nolan", 230000, "photo-1516280440614-37939bbacd81", 60],
    ["The Matrix", "the-matrix", "khoa-hoc-vien-tuong", "Lana Wachowski", 210000, "photo-1524989941526-3c94f5d0e211", 50],
>>>>>>> 1b2c821cbcc5d33b9cb350e29faa5868987cf37b
  ];
  for (const [name, slug, cat, director, price, photo, stock] of items) {
    await Product.updateOne(
      { slug },
<<<<<<< HEAD
      {
        $setOnInsert: {
          name,
          slug,
          categoryId: cats[cat],
          director,
          price,
          stock,
          image: img(photo),
          description: `${name} - đạo diễn ${director}.`,
          isFeatured: true,
          isActive: true,
        },
      },
      { upsert: true },
    );
  }
  console.log("Seed xong. Admin: admin / 123456");
=======
      { $setOnInsert: { name, slug, categoryId: cats[cat], director, price, stock, image: img(photo), description: `${name} - đạo diễn ${director}.`, isFeatured: true, isActive: true } },
      { upsert: true },
    );
  }
  console.log("Seed xong. Admin: admin / admin123");
>>>>>>> 1b2c821cbcc5d33b9cb350e29faa5868987cf37b
  await mongoose.disconnect();
})();
