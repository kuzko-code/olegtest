'use strict';
var crypto = require('crypto');
require('dotenv').config();
const private_key = process.env.PRIVATE_KEY || 'secret';

const initialCAllergyCategories = [
  {
    "role": "root_admin",
    "email": process.env.USER_EMAIL,
    "password": crypto.createHmac('sha256', private_key).update(process.env.USER_PASSWORD).digest('hex'),
    "username": process.env.USER_NAME
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      initialCAllergyCategories.map(r => ({
        role: r.role,
        email: r.email,
        password: r.password,
        username: r.username
      })),
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
