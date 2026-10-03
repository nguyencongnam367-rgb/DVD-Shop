const express = require("express");
const router = express.Router();
const cartController = require("../../app/controllers/cartController");

router.get("/", cartController.index);
router.post("/add", cartController.add);
router.get("/checkout", cartController.checkout);
router.post("/checkout", cartController.placeOrder);
router.get("/orders", cartController.orderHistory);
router.get("/orders/:orderCode", cartController.orderSuccess);

module.exports = router;
