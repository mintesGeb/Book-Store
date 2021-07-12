var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

/* GET users listing. */
router.post("/login", userController.login);
router.use("/", userController.authorize);

module.exports = router;
