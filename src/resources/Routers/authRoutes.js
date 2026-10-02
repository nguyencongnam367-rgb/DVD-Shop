const express = require("express");
const router = express.Router();
const authController = require("../../app/controllers/authController");

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/register", authController.showRegister);
router.post("/register", authController.register);
<<<<<<< HEAD
router.get("/logout", authController.logout);
=======
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2

module.exports = router;
