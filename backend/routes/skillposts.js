const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');

const adapter = new FileSync('../db.json');
const db = low(adapter);

router.get('/', (req, res) => {
  const posts = db.get('skillposts').value();
  res.json(posts);
});

router.post('/', auth, (req, res) => {
  const post = { id: uuidv4(), ...req.body, created_by: req.user.email, created_date: new Date().toISOString(), status: 'active' };
  db.get('skillposts').push(post).write();
  res.json(post);
});

router.put('/:id', auth, (req, res) => {
  db.get('skillposts').find({ id: req.params.id }).assign(req.body).write();
  res.json(db.get('skillposts').find({ id: req.params.id }).value());
});

router.delete('/:id', auth, (req, res) => {
  db.get('skillposts').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

module.exports = router;