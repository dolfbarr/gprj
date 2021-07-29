import {mockDirs, trimArray} from '../../utils/helpers'
import List from '../list'
import chalk from 'chalk'
import * as db from '../../utils/database'
import {mocked} from 'ts-jest/utils'

chalk.level = 0

jest.mock('../../utils/git', () => ({
  branch: jest.fn().mockResolvedValue({current: 'main'}),
}))

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    value: () => [{path: 'repo'}, {path: 'prj'}],
  })),
}))
const mockGetDB = mocked(db.getDB, true)

describe('List Command', () => {
  let result: string[]

  beforeEach(() => {
    result = []

    mockDirs({repo: {}, prj: {}})

    jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val: string) => {
      result.push(val)
      return true
    })
  })

  it('shows repos', async () => {
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1. repo (main)', '  2. prj (main)'])
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
