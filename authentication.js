import { queryDatabase } from "./database.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Get username and password and gives describing message result
export const authenticateUser = async (username, password) => {

    //Find user by username
    const users = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length == 0) {
        return { statusCode: 200, message: 'Invalid username or password!' };
    }

    const user = users[0];
    //Check user password
    if (bcrypt.compareSync(password, user.pass)) {

        //Create session ID
        const sessionId = crypto.randomBytes(16).toString('hex');
        const insertSessionQuery = 'INSERT INTO sessions (session_id, user_id) VALUES (?, ?)';
        await queryDatabase(insertSessionQuery, [sessionId, user.user_id]);

        return { statusCode: 200, message: 'User authenticated successfully.', sessionId };
    } else {
        return { statusCode: 200, message: 'Invalid username or password!' };
    }
}

export const authorizeUser = async (req) => {
    try {

    } catch (error) {
        throw new Error('Internal server error.');
    }
}

// Get username and password and gives describing message result
export const createUser = async (username, password) => {

    //Checks if username is already taken
    const users = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length != 0) {
        return 'This username is already taken!';
    }

    //Add user to database
    const [result] = await queryDatabase('INSERT INTO users (username, pass) VALUES (?, ?)', [username, password]);
    return 'Succesfully signed in.'
}