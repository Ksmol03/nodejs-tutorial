import mysql from 'mysql2';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10
}).promise();

export const logInUser = async (login, password) => {
    const [row] = await pool.query('SELECT * FROM users WHERE username = ?', [login]);
    if (row.length == 0) {
        return 'There is no user with this username!';
    }
    if (bcrypt.compareSync(password, row[0].pass)) {
        return 'Logged in succesfully.';
    } else {
        return 'Wrong password!';
    }
}

export const signInUser = async (login, password) => {
    const [row] = await pool.query('SELECT * FROM users WHERE username = ?', [login]);
    if (row.length != 0) {
        return 'This username is already taken!';
    }
    const [result] = await pool.query('INSERT INTO users (username, pass) VALUES (?, ?)', [login, password]);
    return 'Succesfully signed in.'
}