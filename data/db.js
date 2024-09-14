const Datastore = require('nedb');
const path = require('path');

const db = {};

db.users = new Datastore({ filename: path.join(__dirname, 'users.db'), autoload: true });
db.admins = new Datastore({ filename: path.join(__dirname, 'admins.db'), autoload: true });
db.unknownUsers = new Datastore({ filename: path.join(__dirname, 'unknown_users.db'), autoload: true });

module.exports = db;