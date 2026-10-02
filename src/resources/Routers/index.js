<<<<<<< HEAD
const authRoutes = require("./authRoutes");
const quantriRoutes = require("./quantri");
const productController = require("../../app/controllers/productController");
const cartController = require("../../app/controllers/cartController");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/admin", quantriRoutes);

  app.get("/", (req, res) => res.redirect("/products"));
  app.get("/products", productController.index);
  app.get("/product/:id", productController.show);
  app.get("/cart", cartController.index);
  app.post("/cart/add", cartController.add);
};
=======
const home = require("./homeRoutes");
const auth = require("./authRoutes");
const cart = require("./cartRoutes");
const product = require("./productRoutes");
const quantri = require("./quantri");

function Routes(app) {
  app.use("/", home);
  app.use("/auth", auth);
  app.use("/cart", cart);
  app.use("/product", product);
  app.use("/products", product);
  app.use("/admin", quantri);
}
module.exports = Routes;
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
