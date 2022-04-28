import {Hook} from '@oclif/core'
import fs from 'fs'
import path from 'path'

import {DB_FILE, getDB} from '../../utils/database'
import {Logger} from '../../utils/renderer'

export const createDataBase: Hook<'init'> = async function () {
  const {info} = new Logger(this.log.bind(this))
  const {dataDir} = this.config

  if (!fs.existsSync(path.join(dataDir, DB_FILE))) {
    info(`Creating db in ${dataDir}`)

    fs.mkdirSync(dataDir)
    await getDB(dataDir)
  }
}
