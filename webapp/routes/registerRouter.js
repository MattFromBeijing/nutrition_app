import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import client from './db';

const dataRouter = express.Router()

dataRouter.use(bodyParser.json());


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
  dataRouter.post('/register', async (req, res) => {
    const { username, password} = req.body;
    try{
      const existing = await usersCollection.findOne({ username })
      if (existing) {
        return res.status(409).send('Username already taken. Please try another one.')
      }
  
      const hasedPassword = await bcrypt.hash(password, 10)
  
      const newUser = {
        userName: username,
        password: hasedPassword
      }
  
      await usersCollection.insertOne(newUser)
  
    } catch (error){
  
    }
  })
  
  