import express from 'express';
import { authenticateUser, addUser } from './authentication.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//Authenticate a user
app.get('/authUser', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await authenticateUser(username, password);

         if (result.statusCode === 200) {
            res.cookie('sessionId', result.sessionId, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1000, // 1 day in milliseconds
                path: '/'
      });
    }

        res.status(result.statusCode).json({message: result.message, sessionId: result.sessionId});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

//Add new user to database
app.post('/addUser', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await addUser(username, password);

        res.status(result.statusCode).json({message: result.message});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})