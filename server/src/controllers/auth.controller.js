const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const store = require("../cache/store");
const env = require("../config/env");

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: "12h"
  });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existingUser = store.users.find((user) => user.email === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new UserModel({ name, email, passwordHash });
  store.users.push(user);

  return res.status(201).json({
    message: "User registered successfully.",
    user: sanitizeUser(user),
    token: signToken(user)
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find((item) => item.email === email?.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password || "", user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    message: "Login successful.",
    user: sanitizeUser(user),
    token: signToken(user)
  });
};

const me = (req, res) => res.json({ user: sanitizeUser(req.user) });

module.exports = {
  register,
  login,
  me
};
