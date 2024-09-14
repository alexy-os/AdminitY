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

router.get('/unknown-users', auth.requireAuth, async (req, res) => {
  const unknownUsers = await db.unknownUsers.find({});
  res.json(unknownUsers);
});

module.exports = router;