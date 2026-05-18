const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const auth = require('../middleware/authMiddleware');

const adapter = new FileSync('../db.json');
const db = low(adapter);

router.get('/me', auth, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  const { password, ...safe } = user;
  res.json(safe);
});

router.put('/me', auth, (req, res) => {
  const { password, ...updates } = req.body; // never allow password update here
  db.get('users').find({ id: req.user.id }).assign(updates).write();
  const user = db.get('users').find({ id: req.user.id }).value();
  const { password: p, ...safe } = user;
  res.json(safe);
});

module.exports = router;