import {expect, test} from '@oclif/test'
import fs from 'fs'
import {tempDatabasePath} from '../../src/utils/helpers'

describe('hello', () => {
  after(() => {
    fs.unlinkSync(tempDatabasePath())
  })

  test
  .stdout()
  .command(['hello'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['hello', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })

  test
  .stdout()
  .command(['hello'])
  .it('runs hello with db', ctx => {
    expect(ctx.stdout).to.contain('  ℹ info  Found repositories: []')
  })
})
