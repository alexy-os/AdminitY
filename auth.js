const db = require('./data/db');
const bcrypt = require('bcrypt');

module.exports = {
  requireAuth: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.redirect('/');
    }
  },

  login: async (username, password) => {
    const admin = await db.admins.findOne({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return admin;
    }
    return null;
  },

  setupFirstTimeAdmin: async (username, password) => {
    const existingAdmin = await db.admins.findOne({});
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    return db.admins.insert(newAdmin);
  }
};