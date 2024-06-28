import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dataRouter from './routes/data.js'
import registerRouter from './routes/registerRouter.js';


const app = express();
const port = 5000;



app.use(cors());

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.use("/data", dataRouter)
app.use('/api', registerRouter)
/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});*/