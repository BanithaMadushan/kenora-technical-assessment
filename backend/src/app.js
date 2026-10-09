
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Workshop Registration Service API",
  });
});

let connectionPromise = null;

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!connectionPromise) {
        connectionPromise = connectDB().finally(() => {
          connectionPromise = null;
        });
      }

      await connectionPromise;
    }

    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api", registrationRoutes);

module.exports = app;
