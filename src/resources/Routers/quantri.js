const express = require("express");
const router = express.Router();
const quantriController = require("../../app/controllers/quantriController");

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  if (req.session.user.role !== "admin") {
    return res.status(403).send("Bạn không có quyền truy cập trang này");
  }
  return next();
}

router.use(requireAdmin);
router.use((req, res, next) => {
  const section = req.path.split("/")[1];
  res.locals.adminActive = section === "products" ? "products" : section;
  next();
});

router.get("/dashboard", quantriController.dashboard);
router.get("/users", quantriController.users);
router.get("/products", quantriController.products);
router.get("/products/add", quantriController.addProduct);
router.post("/products", quantriController.createProduct);
router.get("/products/:id/upgrade", quantriController.upgradeProduct);
router.post("/products/:id/upgrade", quantriController.updateProduct);
router.get("/orders", quantriController.orders);

module.exports = router;
