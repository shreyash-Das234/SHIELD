const { randomUUID } = require("uuid");

class UserModel {
  constructor({ name, email, passwordHash, role = "admin" }) {
    this.id = randomUUID();
    this.name = name;
    this.email = email.toLowerCase();
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = UserModel;
