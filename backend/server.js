const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create users table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Create notes table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        note_text TEXT NOT NULL
    )
`);

// Endpoint to register user
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const insertQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;

    db.run(insertQuery, [email, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
            return res.status(500).json({ message: 'Error registering user', error: err.message });
        }

        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Endpoint to login user
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const selectQuery = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.get(selectQuery, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in', error: err.message });
        }

        if (row) {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Endpoint to create a new note
app.post('/create-note', (req, res) => {
    const { email, noteText } = req.body;
    const insertQuery = `INSERT INTO notes (email, note_text) VALUES (?, ?)`;

    db.run(insertQuery, [email, noteText], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error creating note', error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Note created successfully' });
    });
});

// Endpoint to fetch notes for a specific user
app.get('/notes/:email', (req, res) => {
    const { email } = req.params;
    const selectQuery = `SELECT * FROM notes WHERE email = ?`;

    db.all(selectQuery, [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching notes', error: err.message });
        }
        res.status(200).json({ notes: rows });
    });
});

// Endpoint to delete a note
app.delete('/delete-note/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM notes WHERE id = ?`;

    db.run(deleteQuery, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting note', error: err.message });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    });
});

// Endpoint to update a note
app.put('/update-note/:id', (req, res) => {
    const { id } = req.params;
    const { noteText } = req.body;

    const updateQuery = `UPDATE notes SET note_text = ? WHERE id = ?`;

    db.run(updateQuery, [noteText, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating note', error: err.message });
        }
        res.status(200).json({ message: 'Note updated successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
