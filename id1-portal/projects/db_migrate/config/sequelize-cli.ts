import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: process.env.DB_SSL_MODE || false
    }
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: process.env.DB_SSL_MODE || false
    }
  }
};
