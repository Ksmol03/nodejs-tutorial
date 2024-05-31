import express from 'express';
import { logInUser, signInUser } from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const result = await logInUser(username, password);
        if (result == 'There is no user with this username!') {
            res.status(404).json({message: result});
            return;
        } else if ( result == 'Wrong password!') {
            res.status(401).json({message: result});
            return;
        }
        res.json({message: result});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;

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