import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dataRouter from './routes/data.js'
import registerRouter from './routes/registerRouter.js';
import loginRouter from './routes/loginRouter.js';
import client from './db.js'


const app = express();
const port = 5000;

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/data", dataRouter)
app.use('/api', registerRouter)
app.use('/api', loginRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});*/

process.on('SIGTERM', () => {
  console.info('MongoDB connection closed!')
  client.close();
});