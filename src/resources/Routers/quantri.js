const express = require("express");
const router = express.Router();
const quantriController = require("../../app/controllers/quantriController");

<<<<<<< HEAD
function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.redirect("/auth/login");
}

router.use(requireAdmin);
=======
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
router.get("/dashboard", quantriController.dashboard);
router.get("/users", quantriController.users);
router.get("/products", quantriController.products);
router.get("/orders", quantriController.orders);

module.exports = router;
