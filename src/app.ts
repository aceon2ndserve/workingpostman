import dotenv from 'dotenv';
import express from 'express';
import { addressController } from './controllers/address';

dotenv.config();
const port = 8080;
const app = express();

app.use(express.json());

app.get('/healthcheck', (_, res) => res.status(200).send());
app.post('/', addressController);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
