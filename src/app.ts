import dotenv from 'dotenv';
import express from 'express';
import { addressController } from './controllers/address';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';

const port = 8080;
dotenv.config();

export const sequelizeConnection = new Sequelize(
  'database',
  process.env.USER!,
  process.env.PASSWORD,
  {
    host: '0.0.0.0',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    storage: './src/db/database.sqlite',
    models: [__dirname + '/models/'],
  },
);
sequelizeConnection.addModels([User]);
sequelizeConnection.authenticate().then(() => console.log('db is ready'));
const app = express();

app.use(express.json());

app.get('/healthcheck', (_, res) => res.status(200).send());
app.post('/', addressController);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
