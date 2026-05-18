const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');

const adapter = new FileSync('../db.json');
const db = low(adapter);

router.get('/', (req, res) => res.json(db.get('gallery').value()));

router.post('/', auth, (req, res) => {
  const post = { id: uuidv4(), ...req.body, created_by: req.user.email, created_date: new Date().toISOString(), likes: 0 };
  db.get('gallery').push(post).write();
  res.json(post);
});

module.exports = router;