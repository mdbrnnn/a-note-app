USE a_note_app_db;
INSERT INTO users (email, password) 
VALUES ('testuser@example.com', '$2a$12$3PFGmSdEMuZXVpfKPjbHUOZqAuqGwozKe23YV8K/DaidAt890ot66'); 
INSERT INTO notes (user_id, note_text) 
VALUES (1, 'This is a test note.');
SELECT * FROM users;
SELECT * FROM notes;
SELECT 
    notes.id AS note_id, 
    users.email AS user_email, 
    notes.note_text 
FROM notes
INNER JOIN users ON notes.user_id = users.id;
INSERT INTO notes (user_id, note_text) VALUES (999, 'Invalid user test');
DELETE FROM users WHERE id = 1;
SELECT * FROM notes;
UPDATE notes SET note_text = 'Updated note text' WHERE id = 1;
SELECT * FROM notes WHERE id = 1;

