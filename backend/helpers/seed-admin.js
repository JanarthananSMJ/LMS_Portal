const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("[seed-admin] ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin seed");
    return;
  }

  const existingAdmin = await User.findOne({ userEmail: adminEmail });

  if (existingAdmin) {
    return;
  }

  const hashPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    userName: "admin",
    userEmail: adminEmail,
    password: hashPassword,
    role: "admin",
  });

  console.log(`[seed-admin] Default admin account created (${adminEmail})`);
}

module.exports = seedAdmin;
