const express = require("express");
const router = express.Router();
const quantriController = require("../../app/controllers/quantriController");

router.get("/dashboard", quantriController.dashboard);
router.get("/users", quantriController.users);
router.get("/products", quantriController.products);
router.get("/orders", quantriController.orders);

module.exports = router;
