import chalk from 'chalk'
import mockFS from 'mock-fs'
import {mocked} from 'ts-jest/utils'

import {mockDirs} from '../../test.helpers'
import * as db from '../../utils/database'
import {trimArray} from '../../utils/helpers'
import List from '../list'

chalk.level = 0

jest.mock('../../utils/git', () => ({
  status: jest.fn().mockResolvedValue({ahead: 10, behind: 0, current: 'main'}),
}))

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    value: () => [{dateAdded: 0, path: 'repo'}, {dateAdded: 0, path: 'prj'}] as db.Repo[],
  })),
}))
const mockGetDB = mocked(db.getDB, true)

describe('List Command', () => {
  let result: string[]

  beforeEach(() => {
    result = []

    mockDirs({prj: {}, repo: {}})

    jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val: string) => {
      result.push(val)
      return true
    })
  })

  afterEach(() => {
    mockFS.restore()
  })

  it('shows repos', async () => {
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1. ↑ repo (main)', '  2. ↑ prj (main)'])
  })

  it('shows placeholders with no repos', async () => {
    try {
      (mockGetDB as jest.MockInstance<any, any>).mockImplementation(() => ({
        get: jest.fn().mockReturnThis(),
        value: () => [],
      }))

      await List.run([])
    } catch (error) {
      expect(trimArray(result)).toEqual(['  ℹ info  No repositories has been found', "  ♥  You can use 'add' command to add a repository"])
      expect(error.oclif.exit).toBe(0)
    }
  })
})
