import chalk from 'chalk'
import mockFS from 'mock-fs'

import {handleExitError, mockDirs} from '../../test.helpers'
import * as db from '../../utils/database'
import {trimArray} from '../../utils/helpers'
import Remove from '../remove'

chalk.level = 0

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    value: () => [{dateAdded: 0, path: 'repo'}, {date: 0,  path: 'prj'}, {date: 0,  path: 'repo2'}] as db.Repo[],
    write: jest.fn().mockReturnThis(),
  })),
}))

describe('Remove Command', () => {
  let result: string[]

  beforeEach(() => {
    result = []

    mockDirs({prj: {}, repo: {}, repo2: {}, unknown: {}})

    jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val: any) => {
      result.push(val)
      return true
    })
  })

  afterEach(() => {
    mockFS.restore()
  })

  it('removes repo', async () => {
    await Remove.run(['repo'])
    expect(trimArray(result)).toEqual(['  ✔ done  Repository has been successfully removed'])
  })

  it('removes repos', async () => {
    await Remove.run(['repo', 'repo2'])
    expect(trimArray(result)).toEqual(['  ✔ done  All repositories have been successfully removed'])
  })

  describe('fails with', () => {
    it('path', async () => {
      try {
        await Remove.run([])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Repository is not provided'])
        handleExitError(error)
      }
    })

    it('no repository found', async () => {
      try {
        await Remove.run(['unknown'])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Repository does not exist: unknown'])
        handleExitError(error)
      }
    })
  })
})
