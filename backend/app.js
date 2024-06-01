import express from 'express';
import { authenticateUser, addUser, authorizeUser } from './authentication.js';
import cookieParser from 'cookie-parser';
import { queryDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

//Authenticate a user
app.post('/authenticateUser', async (req, res) => {
    const {username, password} = req.body;

    //Gets results from database.js and turns them into http responses with corresponding statuses
    try {
        const result = await authenticateUser(username, password);

        //Set sesiionId cookie
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
});

//Authorize user based on sessionId
app.get('/authorizeUser', async (req, res) => {
    try {
        const result = await authorizeUser(req);
        console.log('tried');

        res.status(result.statusCode).json({message: result.message, userId: result.sessionId});
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

//Close session
app.delete('/closeSession', async (req, res) => {
    try {
        const result = await authorizeUser(req);

        //Remove session from database
        if (result.statusCode == 200) {
            const closingSessionQuery = 'DELETE FROM sessions WHERE session_id = ?';
            await queryDatabase(closingSessionQuery, [req.cookies.sessionId]);

            return res.status(result.statusCode).json({message: 'Session closed.'});
        }

        res.status(result.statusCode).json({message: result.message});
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
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});