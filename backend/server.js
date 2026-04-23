// Contact Management System with CSRF Protection

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({ 
  origin: FRONTEND_URL, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); // Required for csurf

// Session Configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// In-memory storage (Mock seeding)
const users = [
  {
    username: 'Ritheavong',
    password: bcrypt.hashSync('password123', 10)
  }
];
const contact = [
  {
    id: 1,
    username: 'Seth Kdab',
    phonenumber: '123-456-7890',
  }
];



// Session Middleware
const authenticateSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: No session' });
  }
};

// CSRF Token Route
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const existingUser = users.find(u => u.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = { username };
    res.json({ message: 'Login successful', username });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'No active session' });
  }
});


// Contact Routes

// Get all contacts 
app.get('/api/contacts', authenticateSession, (req, res) => {
  res.json(contact);
});

//Create a new contact
app.post('/api/contacts', authenticateSession, (req, res) => {
  const { username, phonenumber } = req.body;
  if (!username || !phonenumber) return res.status(400).json({ message: 'Username and phone number required' });

  const newContact = {
    id: contact.length + 1,
    username,
    phonenumber
  };
  contact.push(newContact);
  res.status(201).json(newContact);
});

// Update a contact
app.put('/api/contacts/:id', authenticateSession, (req, res) => {
  const { id } = req.params;
  const { username, phonenumber } = req.body;
  const existingContact = contact.find(c => c.id === parseInt(id));

  if (!existingContact) return res.status(404).json({ message: 'Contact not found' });
  if (!username || !phonenumber) return res.status(400).json({ message: 'Username and phone number required' });

  existingContact.username = username;
  existingContact.phonenumber = phonenumber;
  res.json(existingContact);
});

// Delete a contact
app.delete('/api/contacts/:id', authenticateSession, (req, res) => {
  const { id } = req.params;
  const index = contact.findIndex(c => c.id === parseInt(id));

  if (index === -1) return res.status(404).json({ message: 'Contact not found' });

  contact.splice(index, 1);
  res.json({ message: 'Contact deleted' });
});


// Error handling for CSRF errors
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).json({ message: 'Invalid CSRF token' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
