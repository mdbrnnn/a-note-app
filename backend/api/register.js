import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user', error: err.message });
    }

    db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err.message });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
}
