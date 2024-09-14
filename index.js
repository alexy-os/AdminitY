const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const apiRoutes = require('./routes/api');
const auth = require('./auth');
const config = require('./config');
const { db } = require('./data/db');

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    },
    formatDate: function (date) {
      return new Date(date).toLocaleString();
    }
  },
  defaultLayout: 'main',
  extname: '.hbs'
});

// Use the custom Handlebars instance
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

app.post('/auth/telegram', (req, res) => {
  try {
    const { id, username } = req.body;
    console.log('Received username:', username);
    const allowedUsernames = config.allowedUsernames;

    if (!allowedUsernames.includes(username)) {
      console.log('Unauthorized user:', username);
      return res.status(403).json({ success: false, message: 'Unauthorized user', redirect: '/' });
    }

    req.session.user = { id, username };
    console.log('Authentication successful for:', username);
    res.json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    console.error('Error in /auth/telegram:', error);
    res.status(500).json({ success: false, message: 'Internal server error', redirect: '/' });
  }
});

app.get('/login', (req, res) => {
  const botUsername = config.telegramBotUsername;
  const authUrl = '/dashboard';
  res.render('pages/login', { botUsername, authUrl, layout: false, pageTitle: 'Login' });
});

app.get('/dashboard', auth.requireAuth, (req, res) => {
  res.render('pages/dashboard', { user: req.session.user, pageTitle: 'Dashboard', activeRoute: 'dashboard' });
});

app.get('/settings', auth.requireAuth, (req, res) => {
  res.render('pages/settings', { user: req.session.user, pageTitle: 'Settings', activeRoute: 'settings' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware для аутентификации пользователя
app.use((req, res, next) => {
  if (req.session.user) {
    db.findOne({ _id: req.session.user._id }, (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        next();
      } else if (user) {
        req.user = user;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});