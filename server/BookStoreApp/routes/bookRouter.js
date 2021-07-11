const express = require("express");
const router = express.Router();

const bookController = require("../controller/bookController");

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getProductById);
router.post("/", bookController.save);
router.delete("/:id", bookController.deleteProductByID);
router.put("/:id", bookController.updateProductByID);

module.exports = router;
