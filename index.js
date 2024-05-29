const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const PORT = process.env.PORT || 8081;
const app = express();

app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

connection.connect((err) => {
    if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

app.post('/addUser', async (req, res) => {
    const { username, password } = req.body;

    try {
        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        connection.query(checkQuery, [username], (err, result) => {
            if (result.length > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
        })
        
        const insertQuery = 'INSERT INTO users (username, pass) VALUES (?, ?)';
        const result = connection.query(insertQuery, [username, password]);
        res.status(201).json({ message: 'User added successfully.', userId: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }

})

app.listen(PORT, () => {
    console.log(`App is listening http://localhost:${PORT}`);
})