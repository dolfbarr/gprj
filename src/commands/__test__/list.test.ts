import chalk from 'chalk'
import mockFS from 'mock-fs'
import {mocked} from 'ts-jest/utils'

import {mockDirs} from '../../test.helpers'
import * as db from '../../utils/database'
import * as git from '../../utils/git'
import {trimArray} from '../../utils/helpers'
import List from '../list'

chalk.level = 0

jest.mock('../../utils/git', () => ({
  stashList: jest.fn().mockResolvedValue({total: 0}),
  status: jest.fn().mockResolvedValue({ahead: 10, behind: 0, current: 'main', files: []}),
}))
const mockedStatus = mocked(git.status, true)
const mockedStashList = mocked(git.stashList, true)

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
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ↑ repo (main)', '  2.  ↑ prj (main)', '  ℹ info  2 ↑ (ahead)'])
  })

  it('shows repos with behind info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({ahead: 0, behind: 10, current: 'main', files: []})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ↓ repo (main)', '  2.  ↓ prj (main)', '  ℹ info  2 ↓ (behind)'])
  })

  it('shows repos with diverged info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({ahead: 10, behind: 10, current: 'main', files: []})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ⚠ repo (main)', '  2.  ⚠ prj (main)', '  ℹ info  2 ⚠ (diverged)'])
  })

  it('shows repos without info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({ahead: 0, behind: 0, current: 'main', files: []})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.    repo (main)', '  2.    prj (main)'])
  })

  it('shows repos with modified files', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({ahead: 0, behind: 0, current: 'main', files: [{path: '/path/to/file'}]})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.    repo* (main)', '  2.    prj* (main)'])
  })

  it('shows repos with stashes', async () => {
    (mockedStashList as jest.MockInstance<any, any>).mockResolvedValue({total: 10})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1. $  repo* (main)', '  2. $  prj* (main)'])
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
