const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');

const adapter = new FileSync('../db.json');
const db = low(adapter);

router.get('/', auth, (req, res) => {
  const msgs = db.get('messages').filter(m => m.sender_email === req.user.email || m.receiver_email === req.user.email).value();
  res.json(msgs);
});

router.post('/', auth, (req, res) => {
  const msg = { id: uuidv4(), ...req.body, sender_email: req.user.email, created_date: new Date().toISOString(), is_read: false };
  db.get('messages').push(msg).write();
  res.json(msg);
});

module.exports = router;