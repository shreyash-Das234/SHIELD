const jwt = require("jsonwebtoken");
const store = require("../cache/store");
const env = require("../config/env");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = store.users.find((item) => item.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User for token was not found." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
