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
  authenticateUser: (username, password, callback) => {
    db.users.findOne({ username: username, type: 'approved' }, (err, user) => {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, false);
      }
      // Проверка пароля (предполагается, что у вас есть функция comparePassword)
      comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          return callback(err);
        }
        if (isMatch) {
          return callback(null, user);
        } else {
          return callback(null, false);
        }
      });
    });
  }
};