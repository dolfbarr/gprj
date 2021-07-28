import low from 'lowdb'
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

export const getDB = async function (dataDir: string)  {
  const dbPath = join(dataDir, DB_FILE)

  /* istanbul ignore next */
  const db = low(new FileSync<Schema>(isTest() ?  tempDatabasePath() : dbPath))
  db.defaults({repositories: []}).write()

  return db
}
