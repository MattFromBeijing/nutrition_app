import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import client from './db';

const app = express();
const port = 5000;


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.use("/data", dataRouter)
/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});*/