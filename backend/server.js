const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/skillposts', require('./routes/skillposts'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/match-skills', require('./routes/matchSkills'));

app.listen(4000, () => console.log('DoGood backend running on http://localhost:4000'));
app.get('/', (req, res) => res.json({ status: 'DoGood API running ✅' }));