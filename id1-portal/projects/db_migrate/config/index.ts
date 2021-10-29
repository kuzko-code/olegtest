import dotenv from 'dotenv';
dotenv.config();
const path = require('path')
const migrationDirectory = path.join(__dirname, '../../migrations')

export const CONFIGURATIONS = {
    POSTGRATOR: {
        migrationDirectory: migrationDirectory,
        driver: 'pg',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL_MODE || false,
        validateChecksums: false
    }
};

export const REGULAR_EXPRESSIONS = {
    LINK: "^\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"
   };


   export default {
    CONFIGURATIONS,
    REGULAR_EXPRESSIONS
};