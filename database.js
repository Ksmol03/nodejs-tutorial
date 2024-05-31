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

export const queryDatabase = async (query, params) => {
    const [results] = await pool.execute(query, params);
    return results;
  };

// Get login and password and gives describing message result
export const logInUser = async (login, password) => {
    const user = await queryDatabase('SELECT * FROM users WHERE username = ?', [login]);
    if (user.length == 0) {
        return 'Invalid username or password!';
    }
    if (bcrypt.compareSync(password, user[0].pass)) {
        return 'Logged in succesfully.';
    } else {
        return 'Invalid username or password!';
    }
}

// Get login and password and gives describing message result
export const signInUser = async (login, password) => {
    const users = await queryDatabase('SELECT * FROM users WHERE username = ?', [login]);
    if (users.length != 0) {
        return 'This username is already taken!';
    }
    const [result] = await queryDatabase('INSERT INTO users (username, pass) VALUES (?, ?)', [login, password]);
    return 'Succesfully signed in.'
}