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
