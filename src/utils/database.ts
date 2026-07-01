import low, {LowdbSync} from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

export const DB_FILE = 'gprj_db.json'

export interface Repo {
  path: string;
  dateAdded: number;
}

export interface Schema {
  repositories: Repo[];
}

export const getDB = async function (dataDir: string): Promise<LowdbSync<Schema>>  {
  const dbPath = path.join(dataDir, DB_FILE)

  const db = low(new FileSync<Schema>(dbPath))
  db.defaults({repositories: []}).write()

  return db
}
