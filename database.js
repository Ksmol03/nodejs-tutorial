import mysql from 'mysql2';

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

export const getUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export const getUser = async (id) => {
    const [row] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);

    if (row.length == 0) {
        return 'There is no user with this id.'
    }
    return row;
}

export const addUser = async(username, password) => {
    const [result] = await pool.query('INSERT INTO users (username, pass) VALUES (?, ?)', [username, password]);
    return result.insertId; 
}