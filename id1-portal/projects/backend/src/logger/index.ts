import WriteStream = NodeJS.WriteStream;
import {types} from 'util'

class Logger {
    constructor(private infoStream: WriteStream, private errorStream: WriteStream) {
    }

    info(message: string, set_date: boolean = true): void {
        this.infoStream.write(Logger.composeLog(message, set_date));
    }

    error(error: string | Error, set_date: boolean = true): void {
        const message = typeof error === "string" ? error : Logger.composeErrorMessage(error);
        this.errorStream.write(Logger.composeLog(message, set_date));
    }

    static composeLog(message: string, set_date: boolean): string {
        let text = set_date ? `[${(new Date()).toISOString()}] [${process.pid}]: ${message}` : message;
        return text.endsWith('\n') ? text : `${text}\n`;
    }

    static composeErrorMessage(error: Error): string {
        return `${error.message}\n${error.stack}`
    }
}

export const Track = (action: string) => {
    return function (target: any, name: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const start = +new Date();
            logger.info(`${action} started`);
            const result = original.call(this, ...args);

            if (types.isPromise(result)) {
                result.then((result: any) => {
                    logger.info(`${action} finished after ${(+new Date() - start) / 1000} seconds`, false);
                    return result
                })
            } else {
                logger.info(`${action} finished after ${(+new Date() - start) / 1000} seconds`, false)
            }
            return result
        };

        return descriptor
    }
};

//  TODO: add possibility to specify custom logs storage
export const logger = new Logger(process.stdout, process.stderr);
