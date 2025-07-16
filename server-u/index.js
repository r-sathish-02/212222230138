import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log("URL Shortener running on port", process.env.PORT);
  }))
  .catch((err) => console.error("MongoDB connection error:", err));
