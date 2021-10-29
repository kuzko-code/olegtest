const DEFAULT_PORT = 3000;
import dotenv from 'dotenv'

dotenv.config();

export const CONFIGURATIONS = {
    SERVER: {
        PORTAL_ID: process.env.PORTAL_ID,
        API_HOST: process.env.API_HOST,
        HOST_NAME: process.env.HOST_NAME,
        PORT: process.env.PORT || DEFAULT_PORT,
        PUBLIC_HOST: process.env.PUBLIC_HOST || "",
        TZ: process.env.TZ || "Europe/Kiev"
    },
    DB: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL_MODE || false,
        max: process.env.MAX_POOL_SIZE,
        min: process.env.MIN_POOL_SIZE,
        keepAlive: !!process.env.DB_KEEP_ALIVE
    },
    EMAIL: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT!),
        user: process.env.EMAIL_USER || "",
        password: process.env.EMAIL_PASSWORD || ""
    },
    UPLOAD: {
        LOCAL_PATH: process.env.ATTACHMENT_LOCAL_PATH,
        ATTACHMENT_URL: process.env.ATTACHMENT_URL,
        PRIVATE_LOCAL_PATH: process.env.PRIVATE_ATTACHMENT_LOCAL_PATH,
        PRIVATE_ATTACHMENT_URL: process.env.PRIVATE_ATTACHMENT_URL
    },
    ADMIN:{
        USER_EMAIL:process.env.USER_EMAIL,
        USER_PASSWORD: process.env.USER_PASSWORD  
    }
};

export const private_key = process.env.PRIVATE_KEY || 'secret';

export default {
    CONFIGURATIONS,
    private_key
};