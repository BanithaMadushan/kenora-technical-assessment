
const express = require("express");

const {
  createRegistration,
  getRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("manager", "staff"));

router.post(
  "/workshops/:id/register",
  createRegistration
);

router.get(
  "/workshops/:id/registrations",
  getRegistrations
);

router.patch(
  "/registrations/:id/cancel",
  cancelRegistration
);

module.exports = router;
