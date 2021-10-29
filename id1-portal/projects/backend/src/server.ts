import micro, { send } from 'micro';
import cors from 'micro-cors';
import { IncomingMessage, ServerResponse } from "http";
import router from 'fs-router';

import * as path from 'path'
import { Response } from './etc/http/response'
import { EXCEPTION_MESSAGES } from './constants'

import { AddressInfo } from "net";
import { logger } from './logger';

import { promises as fs } from "fs";

const rootRoutesPath = path.resolve(__dirname, 'routes');
const pluginsPath = path.resolve(__dirname, 'plugins');
const pluginsRegex = /\/plugins\/(\w+)(.*)/;

async function fileIsExist(path: string) {
    try {
        await fs.access(path)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }

        throw err;
    }

    return true;
}

export const server = micro(cors()(async (req: IncomingMessage, res: ServerResponse) => {
    logger.info(`new incoming message: ${req.method} ${req.url}`);

    if (req.method === 'OPTIONS') {  
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']);
        res.setHeader('Access-Control-Allow-Headers', ['content-type,x-prerender,authorization']);
        return send(res, 200, 'ok!');
    }
    
    let match: Function;

    if (pluginsRegex.test(req.url!)) {
        const groups = req.url!.match(pluginsRegex);
        const pluginName = groups![1];
        const relativeUrl = groups![2];

        const pluginRoutesPath = path.resolve(pluginsPath, `${pluginName}/routes`);

        if (!(await fileIsExist(pluginRoutesPath))) {
            return send(res, 404, new Response({ error_message: EXCEPTION_MESSAGES.ON_ROUTE_NOT_FOUND_EXCEPTION }));
        }

        match = router(pluginRoutesPath);

        req.url = relativeUrl || "/";
    }
    else {
        match = router(rootRoutesPath);
    }

    const matched = match(req);

    if (matched) return await matched(req, res)
        .catch((err: Error) => {
            logger.error(`Unhandled rejection detected`);
            logger.error(err);
            return send(res, 418, new Response({ error_message: EXCEPTION_MESSAGES.ON_UNHANDLED_ERROR_EXCEPTION }));
        });

    return send(res, 404, new Response({ error_message: EXCEPTION_MESSAGES.ON_ROUTE_NOT_FOUND_EXCEPTION }));
}));
server.timeout = 900000;
const graceful = (signal?: string) => {
    logger.info(`RECEIVED ${signal} SIGNAL \n\t closing server...`);
    server.close(() => process.exit(0));
};

// Stop graceful
process.once('SIGTERM', graceful);
process.once('SIGINT', graceful);
process.on('uncaughtException', (err: Error) => {
    logger.error('Unhandled exception');
    logger.error(err, false);

    graceful();
}
);
process.on('unhandledRejection', (error: {} | null | undefined, promise: Promise<any>) => {
    logger.error('Unhandled rejection');
    logger.error(<Error>error, false);

    graceful()
});

setInterval(() => {
    const {
        rss,
        heapTotal,
        heapUsed,
        external,
    } = process.memoryUsage();

    const to_mb = (key: string, value: number) => `${key}: ${Math.round(value / 1024 / 1024 * 100) / 100} MB`;

    logger.info(`[Memory usage statistics: 
   ${to_mb('rss', rss)}
   ${to_mb('heapTotal', heapTotal)}
   ${to_mb('heapUsed', heapUsed)}
   ${to_mb('external', external)}`)
}, 3600000);

process.on('warning', () => logger.error);

server.once('listening', () => {
    const {
        port,
        address
    } = server.address() as AddressInfo;

    logger.info(`server listening on ${address}:${port}`)
});