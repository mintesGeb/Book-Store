var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

/* GET users listing. */
router.post("/login", userController.login);
router.post("/user/signup", userController.signUp);

router.post("/cart/addtocart", userController.addToCart);

router.get("/cart/:id", userController.showCart);

router.post("/cart/removefromcart", userController.removeFromCart);

router.use("/", userController.authorize);

module.exports = router;
