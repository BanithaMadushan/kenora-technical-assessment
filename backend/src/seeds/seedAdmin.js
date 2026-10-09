require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin account already exists");

      await mongoose.connection.close();
      process.exit(0);
    }

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin account created successfully");
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();