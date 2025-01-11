import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.execute('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging in', error: err.message });
    }
    if (!results.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    });
  });
}
