import { queryDatabase } from "./database.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Authenticate user based on username and password with describing feedback
export const authenticateUser = async (username, password) => {

    //Find user by username
    const users = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length == 0) {
        return { statusCode: 401, message: 'Invalid username or password!' };
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
        return { statusCode: 401, message: 'Invalid username or password!' };
    }
}

// Add user to database and send information back
export const addUser = async (username, password) => {

    //Checks if username is already taken
    const users = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length != 0) {
        return { statusCode: 409, message: 'This username is already taken!' };
    }

    //Add user to database
    const result = await queryDatabase('INSERT INTO users (username, pass) VALUES (?, ?)', [username, password]);
    return { statusCode: 200, message: 'Succesfully signed in.' };
}