import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "User exists" });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name: user.name } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name } });
};
