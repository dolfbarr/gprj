
import chalk from 'chalk'

import {Repo} from '../database'
import {findRepositories} from '../helpers'

chalk.level = 0

const mockedRepositories: Repo[] = [{
  dateAdded: 0,
  path: '/path/to/repo',
},
{
  dateAdded: 0,
  path: '/path/to/prj',
},
{
  dateAdded: 0,
  path: '/path/to/new',
}]

describe('helpers', () => {
  describe('findRepositories', () => {
    it('finds a repository', () => {
      expect(findRepositories(['repo'], mockedRepositories)).toEqual([mockedRepositories[0]])
    })

    it('finds a repository by index', () => {
      expect(findRepositories(['@1'], mockedRepositories)).toEqual([mockedRepositories[0]])
    })

    it('fails to find a repository', () => {
      try {
        findRepositories(['unknown'], mockedRepositories)
      } catch (error) {
        expect(error.message).toEqual('Repository does not exist: unknown')
      }
    })

    it('fails to find a repository with non-numeric index', () => {
      try {
        findRepositories(['@unknown'], mockedRepositories)
      } catch (error) {
        expect(error.message).toEqual('Repository does not exist: @unknown')
      }
    })
  })
})