import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dataRouter from './routes/data.js'
import registerRouter from './routes/registerRouter.js';
import loginRouter from './routes/loginRouter.js';
import client from './db.js'

const app = express();
const port = 5000;

console.log(process.env.CLIENT_URL)

const corsOptions ={
    origin: '*',
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionSuccessStatus:200
}

app.options("*", cors(corsOptions)); 

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/data", dataRouter)
app.use('/api', registerRouter)
app.use('/api', loginRouter);

app.listen(port, () => {
  console.log(`App listening at http://backend:${port}`);
});

process.on('SIGTERM', () => {
  console.info('MongoDB connection closed!')
  client.close();
});