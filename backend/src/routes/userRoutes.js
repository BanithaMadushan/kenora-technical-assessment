const express = require("express");

const {
  createUser,
  getUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createUser
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);

module.exports = router;