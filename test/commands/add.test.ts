import {expect, test} from '@oclif/test'
import fs from 'fs'
import {tempDatabasePath} from '../../src/utils/helpers'

describe('add', () => {
  test
  .stdout()
  .command(['add'])
  .it('runs add', ctx => {
    expect(ctx.stdout).to.contain('  ✖ fail  Path is not provided')
  })

  describe('with database checks', () => {
    after(() => {
      fs.unlinkSync(tempDatabasePath())
    })

    test
    .stdout()
    .command(['add', '/path/to/repo'])
    .it('runs add /path/to/repo x2', ctx => {
      expect(ctx.stdout).to.contain('  ✔ done  Repository has been successfully added')
    })

    test
    .stdout()
    .command(['add', '/path/to/repo'])
    .command(['add', '/path/to/repo'])
    .it('runs add /path/to/repo x2', ctx => {
      expect(ctx.stdout).to.contain('  ✖ fail  Repository already exists')
    })
  })
})
