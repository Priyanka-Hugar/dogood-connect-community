const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/skillposts', require('./routes/skillposts'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/match-skills', require('./routes/matchSkills'));

app.listen(4000, () => console.log('DoGood backend running on http://localhost:4000'));
app.get('/', (req, res) => res.json({ status: 'DoGood API running ✅' }));
