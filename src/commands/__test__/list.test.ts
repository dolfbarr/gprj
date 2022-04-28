import { ExitError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import mockFS from 'mock-fs'

import {mockDirs} from '../../test.helpers'
import * as db from '../../utils/database'
import * as git from '../../utils/git'
import {trimArray} from '../../utils/helpers'
import List from '../list'

chalk.level = 0

const statusMock = {ahead: 0, behind: 0, conflicted: [], current: 'main', files: []}
jest.mock('../../utils/git', () => ({
  stashList: jest.fn(),
  status: jest.fn(),
}))
const mockedStatus = jest.mocked(git.status, true)
const mockedStashList = jest.mocked(git.stashList, true)

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    value: jest.fn(),
  })),
}))
const mockGetDB = jest.mocked(db.getDB, true)

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
    });

    (mockedStatus as jest.MockInstance<any, any>).mockImplementation(() => Promise.resolve(statusMock));
    (mockedStashList as jest.MockInstance<any, any>).mockResolvedValue({total: 0});
    (mockGetDB as jest.MockInstance<any, any>).mockImplementation(() => ({
      get: jest.fn().mockReturnThis(),
      value: () => [{dateAdded: 0, path: 'repo'}, {dateAdded: 0, path: 'prj'}] as db.Repo[],
    }))
  })

  afterEach(() => {
    mockFS.restore()
  })

  it('shows repos', async () => {
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.    repo (main)', '  2.    prj (main)'])
  })

  it('shows repos with ahead info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({...statusMock, ahead: 10})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ↑ repo (main)', '  2.  ↑ prj (main)', '  ℹ info  2 ↑ (ahead)'])
  })

  it('shows repos with behind info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({...statusMock, behind: 10})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ↓ repo (main)', '  2.  ↓ prj (main)', '  ℹ info  2 ↓ (behind)'])
  })

  it('shows repos with diverged info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({...statusMock, ahead: 10, behind: 10})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.  ⚠ repo (main)', '  2.  ⚠ prj (main)', '  ℹ info  2 ⚠ (diverged)'])
  })

  it('shows repos with modified info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({...statusMock, files: [{path: '/path/to/file'}]})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.    repo* (main)', '  2.    prj* (main)', '  ℹ info  2 * (modified)'])
  })

  it('shows repos with conflicted info', async () => {
    (mockedStatus as jest.MockInstance<any, any>).mockResolvedValue({...statusMock, conflicted: ['/path/to/file'], files: [{path: '/path/to/file'}]})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1.    repo* (main)', '  2.    prj* (main)', '  ℹ info  2 * (conflicted)'])
  })

  it('shows repos with stashed info', async () => {
    (mockedStashList as jest.MockInstance<any, any>).mockResolvedValue({total: 10})
    await List.run([])
    expect(trimArray(result)).toEqual(['All repositories:', '  1. $  repo (main)', '  2. $  prj (main)',  '  ℹ info  2 $ (stashed)'])
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

      if (error instanceof ExitError) {
        expect(error.oclif.exit).toBe(0)
      }
    }
  })
})
