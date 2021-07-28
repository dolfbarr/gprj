import low, {LowdbSync} from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import {join} from 'path'
import {isTest, tempDatabasePath} from './helpers'

export const DB_FILE = 'gprj_db.json'

export interface Repo {
  path: string;
}

export interface Schema {
  repositories: Repo[];
}

/* istanbul ignore next */
export const getDB = async function (dataDir: string): Promise<LowdbSync<Schema>>  {
  const dbPath = join(dataDir, DB_FILE)

  const db = low(new FileSync<Schema>(isTest() ?  tempDatabasePath() : dbPath))
  db.defaults({repositories: []}).write()

  return db
}
