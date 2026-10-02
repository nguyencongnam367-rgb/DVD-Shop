const express = require("express");
const router = express.Router();
const homeController = require("../../app/controllers/homeController");

router.get("/", homeController.index);
router.get("/home", homeController.index);
router.get("/home/:slug", homeController.show);

module.exports = router;
