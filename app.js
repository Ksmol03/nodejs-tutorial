import express from 'express';
import { getUser, getUsers, addUser } from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.send(users);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const users = await getUser(id);
        if (users == 'There is no user with this id.') {
            res.status(404).json({message: 'There is no user with this id.'});
            return;
        }
        res.send(users);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})