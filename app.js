import express from 'express';
import { queryDatabase } from './database.js';
import { authenticateUser, createUser } from './authentication.js';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//Authenticate a user
app.get('/authUser', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await authenticateUser(username, password);
        if ( result == 'Invalid username or password!') {
            res.status(result.statusCode).json({message: result.message});
            return;
        }

        //Creates a cookie session
        const user = result[0];
        const sessionId = crypto.randomBytes(16).toString('hex');

        // const insertionQuery = 'INSERT INTO sessions (session_id, user_id) VALUES (?, ?)'
        // await queryDatabase()

        res.status(result.statusCode).json({message: result.message, sessionId: result.sessionId});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await createUser(username, password);
        if (result == 'This username is already taken!') {
            res.status(409).json({message: result});
            return;
        }
        res.json({message: result});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})