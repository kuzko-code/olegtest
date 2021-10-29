import {CONFIGURATIONS} from './config';
import Postgrator, { Options } from 'postgrator';

export const postgrator = new Postgrator(CONFIGURATIONS.POSTGRATOR as Options);