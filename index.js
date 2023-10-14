const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Baca data dari teachers.json dan users.json
const teachersData = require('./data/teachers.json');
const userData = require('./data/users.json');

const app = express();

app.use(bodyParser.json());

// Kunci rahasia untuk JWT
const secretKey = 'rahasia_JWT';

// Middleware untuk memeriksa token JWT
const verifyToken = (req, res, next) => {


  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token belum ada' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'sukses token' });
    }

    req.userId = decoded.id;
    next();
  });
};

// API untuk login dan menghasilkan token JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Cari user berdasarkan username dan password (tanpa hashing)
  const user = userData.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication gagal' });
  }

  // Buat token JWT
  const token = jwt.sign({ id: user.id }, secretKey);

  res.json({ token });
});

// API untuk mendapatkan semua data guru
app.get('/teachers', verifyToken, (req, res) => {
  res.json(teachersData);
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
