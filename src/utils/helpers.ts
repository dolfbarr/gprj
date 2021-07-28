import {join, resolve} from 'path'
import {DB_FILE} from './database'

export const isTest = () => process.env.NODE_ENV === 'test'

export const tempDatabasePath = () => join(resolve(__dirname, '../../test'), DB_FILE)
