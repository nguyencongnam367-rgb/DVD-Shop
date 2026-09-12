const express = require("express"); //khai báo express
const router = express.Router(); //gọi router từ express
const homeController = require("../../app/controllers/homeController"); //khởi tạo homeController để gọi đến method index

router.use("/", homeController.index); // gọi ra method index trong homeController để render ra trang home

module.exports = router;
