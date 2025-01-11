db.execute('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
  if (err) {
      return res.status(500).json({ message: 'Error checking user', error: err.message });
  }
  if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          return res.status(500).json({ message: 'Error registering user', error: err.message });
      }

      db.execute(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [email, hashedPassword],
          (err) => {
              if (err) {
                  return res.status(500).json({ message: 'Error registering user', error: err.message });
              }
              res.status(201).json({ message: 'User registered successfully' });
          }
      );
  });
});
