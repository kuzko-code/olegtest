import {Pool, PoolClient, PoolConfig} from 'pg';
import {CONFIGURATIONS} from '../config';
import {logger} from '../logger';

export const db = new Pool(CONFIGURATIONS.DB as PoolConfig);

//  spawn isolate db connection (for transactions needs)
export const spawnClient = async (): Promise<PoolClient> => db.connect();

db.on('connect', () => {
    logger.info('db connection established');
});

db.on('error', err => logger.error(err));

const log_pool_health = () => {
    logger.info(`Pool health report:`);
    logger.info(`total number of clients existing within the pool: ${db.totalCount}`, false);
    logger.info(`The number of clients which are not checked out but are currently idle in the pool: ${db.idleCount}`, false);
    logger.info(`The number of queued requests waiting on a client: ${db.waitingCount}`, false);
    logger.info('end.\n\n', false)
};

setInterval(log_pool_health, 3600000);
