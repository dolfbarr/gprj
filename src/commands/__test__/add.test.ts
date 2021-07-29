import Add from '../add'
import chalk from 'chalk'
import * as db from '../../utils/database'
import {mocked} from 'ts-jest/utils'
import {mockDirs, trimArray} from '../../utils/helpers'
import mockFS from 'mock-fs'
import * as git from '../../utils/git'

chalk.level = 0

const PATH_TO_REPO = '/path/to/repo'

jest.mock('../../utils/git', () => ({
  checkIsRepo: jest.fn().mockResolvedValue(true),
}))
const mockCheckIsRepo = mocked(git.checkIsRepo, true)

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    push: jest.fn().mockReturnThis(),
    write: jest.fn().mockReturnThis(),
    value: () => [{path: 'repo'}, {path: 'prj'}],
  })),
}))
const mockGetDB = mocked(db.getDB, true)

describe('Add Command', () => {
  let result: string[]

  beforeEach(() => {
    result = []

    mockDirs({[PATH_TO_REPO]: {}})

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

  it('adds repo', async () => {
    await Add.run([PATH_TO_REPO])
    expect(trimArray(result)).toEqual(['  ✔ done  Repository has been successfully added'])
  })

  describe('fails with', () => {
    it('path', async () => {
      try {
        await Add.run([])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Path is not provided'])
        expect(error.oclif.exit).toBe(1)
      }
    })

    it('no dir', async () => {
      mockFS.restore()
      mockDirs()

      try {
        await Add.run([PATH_TO_REPO])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Directory does not exist'])
        expect(error.oclif.exit).toBe(1)
      }
    })

    it('file path', async () => {
      mockFS.restore()
      mockDirs({[PATH_TO_REPO]: 'file content'})

      try {
        await Add.run([PATH_TO_REPO])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Path should be a directory'])
        expect(error.oclif.exit).toBe(1)
      }
    })

    it('non-git dir', async () => {
      (mockCheckIsRepo as jest.MockInstance<any, any>).mockImplementation(() => false)

      try {
        await Add.run([PATH_TO_REPO])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Path is not a git repository'])
        expect(error.oclif.exit).toBe(1)
      }
    })

    it('existing repo', async () => {
      (mockGetDB as jest.MockInstance<any, any>).mockImplementation(() => ({
        get: jest.fn().mockReturnThis(),
        value: () => [{path: PATH_TO_REPO}],
      }))

      try {
        await Add.run([PATH_TO_REPO])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Repository already exists'])
        expect(error.oclif.exit).toBe(1)
      }
    })
  })
})
