import {Hook} from '@oclif/config'
import fs from 'fs'
import {join} from 'path'
import {DB_FILE, getDB} from '../../utils/database'
import {Logger} from '../../utils/renderer'

/* istanbul ignore next */
export const createDataBase: Hook<'init'> = async function () {
  const {info} = new Logger(this.log)
  const {dataDir} = this.config

  if (!fs.existsSync(join(dataDir, DB_FILE))) {
    info(`Creating db in ${dataDir}`)

    /* istanbul ignore next */
    fs.mkdirSync(dataDir)
    await getDB(dataDir)
  }
}
