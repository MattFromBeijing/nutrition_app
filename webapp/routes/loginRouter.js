import express from 'express';
import bcrypt from 'bcrypt';
import client from '../db.js';

const loginRouter = express.Router();

// client.connect(err => {
// if (err) {
//     console.log('Failed to connect to MongoDB', err)
//     process.exit(1);
// }
// console.log('Connected to MongoDB')
// })

const db = client.db('user')
const usersCollection = db.collection('users')

loginRouter.post( '/login', async (req, res) => {
    const {username, password} = req.body;
    //check if the specific user object exists in the database
    try{
        const existing = await usersCollection.findOne({username})
        
        if(!existing){
            return res.status(404).send('Username and/or password are incorrect.')
        }

        const auth = await bcrypt.compare(password, existing.password);

        if(!auth){
            return res.status(404).send('Username and/or password are incorrect.')
        }
        res.status(200).send('Login Successful!')
    }
    catch (err){
        console.log('Error during login:', err);
        res.status(500).send('Internal server error')
    }
    
});

export default loginRouter;