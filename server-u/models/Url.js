import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true },
  url: String,
  expiry: Date,
  clicks: [clickSchema]
}, { timestamps: true });

export default mongoose.model("Url", urlSchema);
