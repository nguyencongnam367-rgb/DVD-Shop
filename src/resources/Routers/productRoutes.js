const express = require("express");
const router = express.Router();
const productController = require("../../app/controllers/productController");

router.get("/", productController.index);
router.get("/:id", productController.show);

module.exports = router;
