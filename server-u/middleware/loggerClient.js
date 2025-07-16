import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const Log = async (stack, level, pkg, message) => {
  try {
    await axios.post(process.env.LOGGER_URL, {
      stack,
      level,
      package: pkg,
      message
    }, {
      headers: {
        Authorization: `Bearer ${process.env.LOGGER_TOKEN}`
      }
    });
  } catch (err) {
    console.error("Log error:", err.response?.data || err.message);
  }
};
