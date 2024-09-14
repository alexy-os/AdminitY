const express = require('express');
const router = express.Router();
const db = require('../data/db');
const auth = require('../auth');

router.get('/telegram/:username_bot', auth.requireAuth, async (req, res) => {
  const { username_bot } = req.params;

  // Fetch data from database
  const users = await db.users.find({ username_bot });
  const usernames = users.map(user => user.username);
  
  res.json({ username_bot: usernames });
});

router.post('/users', auth.requireAuth, async (req, res) => {
  const { username, username_bot } = req.body;
  const newUser = await db.users.insert({ username, username_bot });
  res.json(newUser);
});

router.put('/users/:id', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  const { username, username_bot } = req.body;
  const updatedUser = await db.users.update({ _id: id }, { $set: { username, username_bot } }, { returnUpdated: true });
  res.json(updatedUser);
});

router.delete('/users/:id', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  await db.users.remove({ _id: id });
  res.sendStatus(204);
});

// Users route
router.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];
  res.render('pages/users', { users, activeRoute: 'users' });
});

// New User route
router.get('/users/new', (req, res) => {
  res.render('pages/users-new', { activeRoute: 'users-new' });
});

router.post('/users/create', (req, res) => {
  // Here you would typically save the new user to a database
  console.log('New user:', req.body);
  res.redirect('/users');
});

// Lead Users route
router.get('/lead-users', (req, res) => {
  const leadUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', leadScore: 85, lastActivity: '2023-05-15' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', leadScore: 72, lastActivity: '2023-05-14' },
  ];
  res.render('pages/lead-users', { leadUsers, activeRoute: 'lead-users' });
});

module.exports = router;