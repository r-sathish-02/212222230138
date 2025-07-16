export const authenticateLogger = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token !== process.env.LOGGER_TOKEN) {
    return res.status(403).json({ error: "Unauthorized logging request" });
  }
  next();
};
