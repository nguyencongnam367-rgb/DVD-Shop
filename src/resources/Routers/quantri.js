const express = require("express");
const router = express.Router();
const quantriController = require("../../app/controllers/quantriController");

function requireAdmin(req, res, next) {
<<<<<<< HEAD
  if (!req.session.user) return res.redirect("/auth/login");
  if (req.session.user.role !== "admin") {
    return res.status(403).send("Bạn không có quyền truy cập trang này");
  }
  return next();
=======
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.redirect("/auth/login");
>>>>>>> 1b2c821cbcc5d33b9cb350e29faa5868987cf37b
}

router.use(requireAdmin);
router.get("/dashboard", quantriController.dashboard);
router.get("/users", quantriController.users);
router.get("/products", quantriController.products);
router.get("/orders", quantriController.orders);

module.exports = router;
