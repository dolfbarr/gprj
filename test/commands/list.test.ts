import {expect, test} from '@oclif/test'
import fs from 'fs'
import {tempDatabasePath} from '../../src/utils/helpers'

describe('list', () => {
  after(() => {
    fs.unlinkSync(tempDatabasePath())
  })

  test
  .stdout()
  .command(['list'])
  .it('runs list with no repos', ctx => {
    expect(ctx.stdout).to.contain('  ℹ info  No repositories has been found')
    expect(ctx.stdout).to.contain('  ♥  You can use \'add\' command to add a repository')
    expect(ctx.stdout).not.to.contain('All repositories:')
  })

  test
  .stdout()
  .command(['add', '/path/to/repo'])
  .command(['add', ''])
  .command(['add', 'prj'])
  .command(['list'])
  .it('runs list', ctx => {
    expect(ctx.stdout).to.contain('All repositories:\n\n  1. repo\n  2. prj\n')
  })
})
