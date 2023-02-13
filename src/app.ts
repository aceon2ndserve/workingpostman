import dotenv from 'dotenv';
import express from 'express';
import { addressController } from './controllers/address';
import { Sequelize, DataTypes } from 'sequelize';
const port = 8080;
dotenv.config();

const sequelize = new Sequelize('database', process.env.USER!, process.env.PASSWORD, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  storage: './src/db/database.sqlite',
});
sequelize.authenticate().then(() => console.log('db is ready'));

export const User = sequelize.define('User', {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const app = express();

app.use(express.json());

app.get('/healthcheck', (_, res) => res.status(200).send());
app.post('/', addressController);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
