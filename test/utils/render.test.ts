import {expect, test} from '@oclif/test'
import {getIcon, Icons, padding, Logger} from '../../src/utils/renderer'
import chalk from 'chalk'

chalk.level = 0

const message = 'GPRJ is awesome!'
const {render, notification, line, lineAll, heading, done, fail, info, warn, fav, empty} = new Logger(() => null)

describe('renderer', () => {
  describe('paddings', () => {
    test.it('adds paddings', () => {
      expect(padding(message, {start: 2, end: 2})).to.equal(`  ${message}  `)
    })

    test.it('adds start paddings', () => {
      expect(padding(message, {start: 2})).to.equal(`  ${message}`)
    })

    test.it('adds end paddings', () => {
      expect(padding(message, {end: 2})).to.equal(`${message}  `)
    })

    test.it('adds no paddings', () => {
      expect(padding(message)).to.equal(message)
    })

    test.it('adds no paddings with empty message', () => {
      expect(padding('')).to.equal('')
    })
  })

  describe('render', () => {
    test.it('renders message', () => {
      expect(render(message)).to.equal(`  ${message}`)
    })

    test.it('renders message with level', () => {
      expect(render(message, 2)).to.equal(`    ${message}`)
    })
  })

  describe('getIcon', () => {
    test.it('returns correct icon', () => {
      expect(getIcon(Icons.Heart)).to.equal('♥')
    })

    test.it('returns correct icon with label', () => {
      expect(getIcon(Icons.Fail, 'Fail')).to.equal('✖ Fail')
    })
  })

  describe('notification', () => {
    test.it('returns correct icon', () => {
      expect(notification(message, Icons.Warning)).to.equal(`  ⚠  ${message}`)
    })

    test.it('returns correct icon with label', () => {
      expect(notification(message, Icons.Info, 'info')).to.equal(`  ℹ info  ${message}`)
    })

    test.it('returns message without icon', () => {
      expect(notification(message)).to.equal(`    ${message}`)
    })
  })

  describe('notifications', () => {
    test.it('returns done', () => {
      expect(done(message)).to.equal(`  ✔ done  ${message}`)
    })

    test.it('returns fail', () => {
      expect(fail(message)).to.equal(`  ✖ fail  ${message}`)
    })

    test.it('returns info', () => {
      expect(info(message)).to.equal(`  ℹ info  ${message}`)
    })

    test.it('returns warn', () => {
      expect(warn(message)).to.equal(`  ⚠ warn  ${message}`)
    })

    test.it('returns fav', () => {
      expect(fav(message)).to.equal(`  ♥  ${message}`)
    })
  })

  describe('heading', () => {
    test.it('returns heading', () => {
      expect(heading(message)).to.equal(`${message}`)
    })
  })

  describe('empty', () => {
    test.it('returns empty', () => {
      expect(empty()).to.equal('')
    })
  })

  describe('line', () => {
    test.it('renders line', () => {
      expect(line(message, 2)).to.equal(`  2. ${message}`)
    })
  })

  describe('lineAll', () => {
    test.it('renders all lines', () => {
      expect(lineAll([message, message, message])).to.deep.equal([
        `  1. ${message}`,
        `  2. ${message}`,
        `  3. ${message}`,
      ])
    })

    test.it('calculates index paddings', () => {
      expect(lineAll(new Array(10).fill(message))).to.deep.equal([
        `   1. ${message}`,
        `   2. ${message}`,
        `   3. ${message}`,
        `   4. ${message}`,
        `   5. ${message}`,
        `   6. ${message}`,
        `   7. ${message}`,
        `   8. ${message}`,
        `   9. ${message}`,
        `  10. ${message}`,
      ])
    })
  })
})
