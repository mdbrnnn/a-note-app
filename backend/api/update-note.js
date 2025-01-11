import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
    const { noteId } = req.query;
    const { noteText } = req.body;
    const authToken = req.headers.authorization?.split(' ')[1];

    if (!authToken) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    if (!noteText) {
        return res.status(400).json({ message: 'Note text is required' });
    }

    try {
        const decoded = jwt.verify(authToken, SECRET_KEY);
        const email = decoded.email;

        db.query(
            `SELECT id FROM users WHERE email = ?`,
            [email],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching user', error: err.message });
                }

                const userId = results[0]?.id;

                if (!userId) {
                    return res.status(404).json({ message: 'User not found' });
                }

                db.query(
                    `UPDATE notes SET note_text = ? WHERE id = ? AND user_id = ?`,
                    [noteText, noteId, userId],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error updating note', error: err.message });
                        }
                        res.status(200).json({ message: 'Note updated successfully' });
                    }
                );
            }
        );
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
}
