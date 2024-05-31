import express from 'express';
import { logInUser, signInUser } from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const result = await logInUser(username, password);
        res.send(result);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.post('/signin', async (req, res) => {
    const {username, password} = req.body;

    try {
        const result = await signInUser(username, password);
        res.send(result);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})