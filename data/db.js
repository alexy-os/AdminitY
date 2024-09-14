const Datastore = require('nedb');

const db = new Datastore({ filename: 'data/users.db', autoload: true });

const getApprovedUsers = () => {
  return new Promise((resolve, reject) => {
    db.find({ type: 'approved' }).sort({ username: 1 }).exec((err, users) => {
      if (err) reject(err);
      else resolve(users);
    });
  });
};

const getLeadUsers = () => {
  return new Promise((resolve, reject) => {
    db.find({ type: 'lead' }).sort({ timestamp: -1 }).exec((err, users) => {
      if (err) reject(err);
      else resolve(users);
    });
  });
};

const addUser = (userData) => {
  return new Promise((resolve, reject) => {
    db.insert(userData, (err, newUser) => {
      if (err) reject(err);
      else resolve(newUser);
    });
  });
};

module.exports = {
  db,
  getApprovedUsers,
  getLeadUsers,
  addUser,
};