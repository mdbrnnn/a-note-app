const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a connection to the database
const connection = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
 if (err) {
     console.error('Error connecting to MySQL:', err.message);
     return;
 }
 console.log('Connected to MySQL database');
});

module.exports = connection;
