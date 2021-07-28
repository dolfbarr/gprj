import {expect, test} from '@oclif/test'
import chalk from 'chalk'

chalk.level = 0

describe('hello', () => {
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
