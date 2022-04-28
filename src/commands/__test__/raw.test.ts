import chalk from 'chalk'
import execa from 'execa'
import mockFS from 'mock-fs'

import {handleExitError, mockDirs} from '../../test.helpers'
import * as db from '../../utils/database'
import {trimArray} from '../../utils/helpers'
import Raw from '../raw'

chalk.level = 0

jest.mock('execa')
const mockedExeca = jest.mocked(execa, true)

jest.mock('../../utils/database', () => ({
  getDB: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnThis(),
    value: () => [{dateAdded: 0, path: 'repo'}, {date: 0,  path: 'prj'}, {date: 0,  path: 'repo2'}] as db.Repo[],
  })),
}))

describe('Raw Command', () => {
  let result: string[]

  beforeEach(() => {
    result = []

    mockDirs({prj: {}, repo: {}, repo2: {}})

    jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((val: any) => {
      result.push(val)
      return true
    });

    (mockedExeca as jest.MockInstance<any, any>).mockImplementation(() => Promise.resolve(true))
  })

  afterEach(() => {
    mockFS.restore()
  })

  it('runs a raw command', async () => {
    jest.doMock('execa', () => Promise.resolve(true))
    await Raw.run(['repo', '-x=pwd'])
    expect(trimArray(result)).toEqual(['  ✔ done  Command has been successfully executed'])
  })

  it('runs a raw command', async () => {
    jest.doMock('execa', () => Promise.resolve(true))
    await Raw.run(['repo', 'repo2', '-x=pwd'])
    expect(trimArray(result)).toEqual(['  ✔ done  All commands have been successfully executed'])
  })

  describe('fails with', () => {
    it('path', async () => {
      try {
        await Raw.run(['-x=pwd'])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Repository is not provided'])
        handleExitError(error)
      }
    })

    it('no repository found', async () => {
      try {
        await Raw.run(['unknown', '-x=pwd'])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Repository does not exist: unknown'])
        handleExitError(error)
      }
    })

    it('no raw command', async () => {
      try {
        await Raw.run(['repo'])
      } catch (error) {
        expect(trimArray(result)[0]).toContain('  ✖ fail  Missing required flag:')
        expect(trimArray(result)[0]).toContain(' -x, --execute EXECUTE')
        expect(trimArray(result)[0]).toContain('See more help with --help')
        handleExitError(error)
      }
    })

    it('command', async () => {
      (mockedExeca as jest.MockInstance<any, any>).mockImplementation(() => Promise.reject(new Error('command failed')))
      try {
        await Raw.run(['repo', '-x=pwd'])
      } catch (error) {
        expect(trimArray(result)).toEqual(['  ✖ fail  Something went wrong'])
        handleExitError(error)
      }
    })
  })
})
