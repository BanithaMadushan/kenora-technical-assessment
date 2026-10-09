
const express = require("express");

const {
  createWorkshop,
  getWorkshops,
  updateWorkshop,
} = require("../controllers/workshopController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles("manager", "staff"),
  getWorkshops
);

router.post(
  "/",
  authorizeRoles("manager"),
  createWorkshop
);

router.put(
  "/:id",
  authorizeRoles("manager"),
  updateWorkshop
);

module.exports = router;
