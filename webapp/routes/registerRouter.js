import express from 'express';
import bcrypt from 'bcrypt';
import client from '../db.js';


const registerRouter = express.Router()


client.connect(err => {
    if (err) {
      console.log('Failed to connect to MongoDB', err)
      process.exit(1);
    }
    console.log('Connected to MongoDB')
  })
  
  const db = client.db('user')
  const usersCollection = db.collection('users')
  
  //Route to Register
  registerRouter.post('/register', async (req, res) => {
    const { username, password} = req.body; //gets the values from the API request
    try{
      const existing = await usersCollection.findOne({ username })
      if (existing) {
        return res.status(409).send('Username already taken. Please try another one.')
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const newUser = {
        username,
        password: hashedPassword
      }
  
      await usersCollection.insertOne(newUser);
      res.status(201).send('User successfully registered');
    } catch (error){
      console.log('Error occured as:', error);
      res.status(500).send('Internal server error');
    }
  })

  export default registerRouter;
  
  