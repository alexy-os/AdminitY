const express = require('express');
const router = express.Router();
const { db, getApprovedUsers, getLeadUsers, addUser } = require('../data/db');
const auth = require('../auth');

router.get('/', (req, res) => {
  res.render('pages/home', { layout: false, pageTitle: 'Home' });
});

router.get('/test', auth.requireAuth, (req, res) => {
  res.render('test', { layout: false, pageTitle: 'Test WebApp' });
});

router.post('/telegram/:username_bot', async (req, res) => {
  const { username_bot } = req.params;
  const { id, username, ...initData } = req.body; // Данные из initData WebApp
  
  try {
    // Проверяем существование пользователя в группе бота
    const user = await new Promise((resolve, reject) => {
      db.findOne({ username, username_bot }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
    
    console.log('User found:', user); // Отладочная информация

    if (user) {
      // Обновляем существующую запись
      await new Promise((resolve, reject) => {
        db.update(
          { _id: user._id },
          { $set: {
            tg_id: id,
            timestamp: new Date(),
            init_data: initData
          }},
          {},
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      console.log('User updated');
      return res.json({ success: true });
    } else {
      // Сохраняем пользователя как лид
      const newUnknownUser = await addUser({
        tg_id: id,
        username,
        username_bot,
        timestamp: new Date(),
        init_data: initData,
        type: 'lead'
      });
      console.log('Unknown user saved:', newUnknownUser); // Отладочная информация
      return res.json({ success: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', auth.requireAuth, async (req, res) => {
  try {
    const users = await getApprovedUsers();
    res.render('pages/users', { users, pageTitle: 'Approved Users', activeRoute: 'users' });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('pages/error', { message: 'Error fetching users' });
  }
});

router.get('/users/new', auth.requireAuth, (req, res) => {
  res.render('pages/users-new', { activeRoute: 'users-new' });
});

router.post('/users', auth.requireAuth, async (req, res) => {
  const { username, username_bot } = req.body;
  try {
    const newUser = await addUser({ username, username_bot, type: 'approved' });
    console.log('New user created:', newUser);
    res.redirect('/users');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).render('pages/error', { message: 'Error creating user' });
  }
});

router.get('/users/:id/edit', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await new Promise((resolve, reject) => {
      db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
    if (!user) {
      return res.status(404).render('pages/error', { message: 'User not found' });
    }
    res.render('pages/users-edit', { user, activeRoute: 'users' });
  } catch (error) {
    res.status(500).render('pages/error', { message: 'Error fetching user' });
  }
});

router.post('/users/:id', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  const { username, username_bot } = req.body;
  try {
    await new Promise((resolve, reject) => {
      db.update({ _id: id }, { $set: { username, username_bot } }, {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log(`User updated: ID=${id}, Username=${username}, Bot=${username_bot}`);
    res.redirect('/users');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).render('pages/error', { message: 'Error updating user' });
  }
});

router.post('/users/:id/delete', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      db.remove({ _id: id }, {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.redirect('/users');
  } catch (error) {
    res.status(500).render('pages/error', { message: 'Error deleting user' });
  }
});

router.get('/lead-users', auth.requireAuth, async (req, res) => {
  try {
    const users = await getLeadUsers();
    res.render('pages/lead-users', { users, pageTitle: 'Lead Users', activeRoute: 'lead-users' });
  } catch (error) {
    console.error('Error fetching lead users:', error);
    res.status(500).render('pages/error', { message: 'Error fetching lead users' });
  }
});

router.post('/lead-users/:id/delete', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      db.remove({ _id: id }, {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.redirect('/lead-users');
  } catch (error) {
    res.status(500).render('pages/error', { message: 'Error deleting lead user' });
  }
});

router.get('/lead-users/:id/edit', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const leadUser = await new Promise((resolve, reject) => {
      db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
    if (!leadUser) {
      return res.status(404).render('pages/error', { message: 'Lead user not found' });
    }
    res.render('pages/lead-users-edit', { leadUser, activeRoute: 'lead-users' });
  } catch (error) {
    res.status(500).render('pages/error', { message: 'Error fetching lead user' });
  }
});

router.post('/lead-users/:id', auth.requireAuth, async (req, res) => {
  const { id } = req.params;
  const { username, username_bot, tg_id } = req.body;
  try {
    await new Promise((resolve, reject) => {
      db.update({ _id: id }, { $set: { username, username_bot, tg_id } }, {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log(`Lead user updated: ID=${id}, Username=${username}, Bot=${username_bot}`);
    res.redirect('/lead-users');
  } catch (error) {
    console.error('Error updating lead user:', error);
    res.status(500).render('pages/error', { message: 'Error updating lead user' });
  }
});

module.exports = router;