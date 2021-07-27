import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import Memory from 'lowdb/adapters/Memory'
import {join} from 'path'
import {isTest} from './helpers'

export const DB_FILE = 'gprj_db.json'

export const getDB = async function (dataDir: string)  {
  const dbPath = join(dataDir, DB_FILE)
  const db = low(isTest() ?  new Memory(dbPath) : new FileSync(dbPath))
  db.defaults({repositories: []}).write()

  return db
}
