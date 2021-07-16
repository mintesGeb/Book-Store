const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getProductById);
router.post("/", userController.authorizeAdmin, bookController.save);
router.delete(
  "/:id",
  userController.authorizeAdmin,
  bookController.deleteProductByID
);
router.put(
  "/:id",
  userController.authorizeAdmin,
  bookController.updateProductByID
);

module.exports = router;
