
const mongoose = require("mongoose");
const Workshop = require("../models/Workshop");

const createWorkshop = async (req, res) => {
  try {
    const {
      workshopCode,
      title,
      instructor,
      location,
      dateTime,
      capacity,
      status,
    } = req.body;

    const workshop = await Workshop.create({
      workshopCode,
      title,
      instructor,
      location,
      dateTime,
      capacity,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Workshop created successfully",
      data: workshop,
    });
  } catch (error) {
    res.status(
      error.code === 11000 ? 409 :
      error.name === "ValidationError" ? 400 : 500
    ).json({
      success: false,
      message:
        error.code === 11000
          ? "Workshop code already exists"
          : error.message,
    });
  }
};

const getWorkshops = async (req, res) => {
  try {
    const { status, available, from, to } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (available === "true") {
      filter.status = "scheduled";
      filter.$expr = {
        $lt: ["$registeredCount", "$capacity"],
      };
    }

    if (from || to) {
      filter.dateTime = {};

      if (from) {
        const start = new Date(from);
        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date",
          });
        }
        filter.dateTime.$gte = start;
      }

      if (to) {
        const end = new Date(to);
        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date",
          });
        }
        end.setUTCDate(end.getUTCDate() + 1);
        filter.dateTime.$lt = end;
      }
    }

    const workshops = await Workshop.find(filter).sort({
      dateTime: 1,
    });

    res.json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch workshops",
    });
  }
};

const updateWorkshop = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workshop ID",
      });
    }

    const allowedFields = [
      "workshopCode",
      "title",
      "instructor",
      "location",
      "dateTime",
      "capacity",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields supplied",
      });
    }

    const filter = { _id: req.params.id };

    if (updates.capacity !== undefined) {
      if (
        !Number.isInteger(updates.capacity) ||
        updates.capacity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a positive whole number",
        });
      }

      filter.registeredCount = {
        $lte: updates.capacity,
      };
    }

    const workshop = await Workshop.findOneAndUpdate(
      filter,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workshop) {
      return res.status(409).json({
        success: false,
        message: "Workshop not found or capacity too low",
      });
    }

    res.json({
      success: true,
      message: "Workshop updated successfully",
      data: workshop,
    });
  } catch (error) {
    res.status(
      error.code === 11000 ? 409 :
      ["ValidationError", "CastError"].includes(error.name)
        ? 400 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkshop,
  getWorkshops,
  updateWorkshop,
};
