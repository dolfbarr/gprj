
import chalk from 'chalk'

import {getIcon, getStatuses, Icons, Logger, padding} from '../renderer'

chalk.level = 0

const message = 'GPRJ is awesome!'
const {render, notification, line, lineAll, heading, done, fail, info, warn, fav, empty} = new Logger(() => null)

describe('renderer', () => {
  describe('paddings', () => {
    it('adds paddings', () => {
      expect(padding(message, {end: 2, start: 2})).toEqual(`  ${message}  `)
    })

    it('adds start paddings', () => {
      expect(padding(message, {start: 2})).toEqual(`  ${message}`)
    })

    it('adds end paddings', () => {
      expect(padding(message, {end: 2})).toEqual(`${message}  `)
    })

    it('adds no paddings', () => {
      expect(padding(message)).toEqual(message)
    })

    it('adds no paddings with empty message', () => {
      expect(padding('')).toEqual('')
    })
  })

  describe('render', () => {
    it('renders message', () => {
      expect(render(message)).toEqual(`  ${message}`)
    })

    it('renders message with level', () => {
      expect(render(message, 2)).toEqual(`    ${message}`)
    })
  })

  describe('getIcon', () => {
    it('returns correct icon', () => {
      expect(getIcon(Icons.Heart)).toEqual('♥')
    })

    it('returns correct icon with label', () => {
      expect(getIcon(Icons.Fail, 'Fail')).toEqual('✖ Fail')
    })
  })

  describe('getStatuses', () => {
    it('returns ahead', () => {
      expect(getStatuses({status: {ahead: 10, behind: 0}})).toEqual('↑')
    })

    it('returns behind', () => {
      expect(getStatuses({status: {ahead: 0, behind: 10}})).toEqual('↓')
    })

    it('returns diverged', () => {
      expect(getStatuses({status: {ahead: 10, behind: 10}})).toEqual('⚠')
    })

    it('returns SPACE', () => {
      expect(getStatuses({status: {ahead: 0, behind: 0}})).toEqual(' ')
    })
  })

  describe('notification', () => {
    it('returns correct icon', () => {
      expect(notification(message, Icons.Warning)).toEqual(`  ⚠  ${message}`)
    })

    it('returns correct icon with label', () => {
      expect(notification(message, Icons.Info, 'info')).toEqual(`  ℹ info  ${message}`)
    })

    it('returns message without icon', () => {
      expect(notification(message)).toEqual(`    ${message}`)
    })
  })

  describe('notifications', () => {
    it('returns done', () => {
      expect(done(message)).toEqual(`  ✔ done  ${message}`)
    })

    it('returns fail', () => {
      expect(fail(message)).toEqual(`  ✖ fail  ${message}`)
    })

    it('returns info', () => {
      expect(info(message)).toEqual(`  ℹ info  ${message}`)
    })

    it('returns warn', () => {
      expect(warn(message)).toEqual(`  ⚠ warn  ${message}`)
    })

    it('returns fav', () => {
      expect(fav(message)).toEqual(`  ♥  ${message}`)
    })
  })

  describe('heading', () => {
    it('returns heading', () => {
      expect(heading(message)).toEqual(`${message}`)
    })
  })

  describe('empty', () => {
    it('returns empty', () => {
      expect(empty()).toEqual('')
    })
  })

  describe('line', () => {
    it('renders line', () => {
      expect(line(message, 2)).toEqual(`  2. ${message}`)
    })
  })

  describe('lineAll', () => {
    it('renders all lines', () => {
      expect(lineAll([message, message, message])).toEqual([
        `  1. ${message}`,
        `  2. ${message}`,
        `  3. ${message}`,
      ])
    })

    it('calculates index paddings', () => {
      expect(lineAll(new Array(10).fill(message))).toEqual([
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
