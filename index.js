const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const apiRoutes = require('./routes/api');
const auth = require('./auth');
const config = require('./config');

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
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

app.get('/', (req, res) => {
  const botUsername = config.telegramBotUsername;
  const authUrl = '/dashboard';
  res.render('pages/login', { botUsername, authUrl, layout: false, pageTitle: 'Login' });
});

app.post('/auth/telegram', (req, res) => {
  try {
    console.log('Received Telegram auth request:', req.body);
    const { id, first_name, username, photo_url, auth_date, hash } = req.body;
    
    // В этой упрощенной версии мы не проверяем hash
    // Вместо этого мы просто доверяем данным, полученным от виджета Telegram

    // Сохраняем данные пользователя в сессии
    req.session.user = { id, first_name, username, photo_url };
    console.log('Authentication successful');
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /auth/telegram:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
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