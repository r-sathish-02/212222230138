import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  stack: String,
  level: String,
  package: String,
  message: String
});

export default mongoose.model("Log", logSchema);
