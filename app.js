import express from 'express';
import { queryDatabase, logInUser, signInUser } from './database.js';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/login', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await logInUser(username, password);
        if ( result == 'Invalid username or password!') {
            res.status(401).json({message: result});
            return;
        }

        //Creates a cookie session
        const user = result[0];
        const sessionId = crypto.randomBytes(16).toString('hex');

        await 

        res.json({message: result});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await signInUser(username, password);
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