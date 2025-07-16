import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/log", logRoutes);
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log("Logger Service running on port", process.env.PORT);
  }))
  .catch((err) => console.error("MongoDB connection error:", err));