
const mongoose = require("mongoose");
const Workshop = require("../models/Workshop");
const Registration = require("../models/Registration");

const createRegistration = async (req, res) => {
  const { attendeeName, attendeeEmail } = req.body;
  const workshopId = req.params.id;

  if (!mongoose.isValidObjectId(workshopId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid workshop ID",
    });
  }

  if (
    typeof attendeeName !== "string" ||
    !attendeeName.trim() ||
    typeof attendeeEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid attendee name and email are required",
    });
  }

  try {
    let registration;

    await mongoose.connection.transaction(async (session) => {
      const workshop = await Workshop.findOneAndUpdate(
        {
          _id: workshopId,
          status: "scheduled",
          $expr: {
            $lt: ["$registeredCount", "$capacity"],
          },
        },
        {
          $inc: { registeredCount: 1 },
        },
        {
          new: true,
          session,
        }
      );

      if (!workshop) {
        const error = new Error(
          "Workshop is full, unavailable or not found"
        );
        error.statusCode = 409;
        throw error;
      }

      const created = await Registration.create(
        [
          {
            workshop: workshopId,
            attendeeName: attendeeName.trim(),
            attendeeEmail: attendeeEmail.trim().toLowerCase(),
            registeredBy: req.user._id,
            status: "active",
          },
        ],
        { session }
      );

      registration = created[0];
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Registration failed",
    });
  }
};

const getRegistrations = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workshop ID",
      });
    }

    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    const registrations = await Registration.find({
      workshop: req.params.id,
    })
      .populate("registeredBy", "name email role")
      .populate("cancelledBy", "name email role")
      .sort({ registeredAt: -1 });

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

const cancelRegistration = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration ID",
    });
  }

  try {
    let cancelledRegistration;

    await mongoose.connection.transaction(async (session) => {
      const registration = await Registration.findOneAndUpdate(
        {
          _id: req.params.id,
          status: "active",
        },
        {
          $set: {
            status: "cancelled",
            cancelledBy: req.user._id,
            cancelledAt: new Date(),
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!registration) {
        const error = new Error(
          "Registration not found or already cancelled"
        );
        error.statusCode = 409;
        throw error;
      }

      const workshop = await Workshop.findOneAndUpdate(
        {
          _id: registration.workshop,
          registeredCount: { $gt: 0 },
        },
        {
          $inc: { registeredCount: -1 },
        },
        {
          new: true,
          session,
        }
      );

      if (!workshop) {
        throw new Error("Unable to update workshop seat count");
      }

      cancelledRegistration = registration;
    });

    return res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
      data: cancelledRegistration,
    });
  } catch (error) {
    console.error("Cancellation error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Cancellation failed",
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  cancelRegistration,
};
