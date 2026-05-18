const express = require('express');
const router = express.Router();

// Simple keyword-based matching (replace with HuggingFace if you want AI)
router.post('/', (req, res) => {
  const { query, posts } = req.body;
  if (!query || !posts) return res.json({ ranked: [] });

  const q = query.toLowerCase();
  const ranked = posts
    .map(post => {
      const text = `${post.title} ${post.description} ${post.category}`.toLowerCase();
      const words = q.split(' ').filter(Boolean);
      const matches = words.filter(w => text.includes(w)).length;
      const similarity = matches / words.length;
      return { ...post, similarity };
    })
    .filter(p => p.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);

  res.json({ ranked });
});

module.exports = router;