
import chalk from 'chalk'

import {getIcon, getModified, getStatuses, Icons, list, listItem, Logger, padding} from '../renderer'

chalk.level = 0

const message = 'GPRJ is awesome!'
const {render, notification, line, lineAll, heading, done, fail, info, warn, fav, empty, caption} = new Logger(() => null)

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
    describe('ahead and behind', () => {
      it('returns ahead', () => {
        expect(getStatuses({stash: 0, status: {ahead: 10, behind: 0}})).toEqual(' ↑')
      })

      it('returns behind', () => {
        expect(getStatuses({stash: 0, status: {ahead: 0, behind: 10}})).toEqual(' ↓')
      })

      it('returns diverged', () => {
        expect(getStatuses({stash: 0, status: {ahead: 10, behind: 10}})).toEqual(' ⚠')
      })

      it('returns SPACE', () => {
        expect(getStatuses({stash: 0, status: {ahead: 0, behind: 0}})).toEqual('  ')
      })
    })
    describe('stash', () => {
      it('returns stash', () => {
        expect(getStatuses({stash: 10, status: {ahead: 0, behind: 0}})).toEqual('$ ')
      })
    })
  })

  describe('getModified', () => {
    it('returns modified', () => {
      expect(getModified([{path: '/path/to/file'}])).toEqual('*')
    })

    it('returns NIL if not modified', () => {
      expect(getModified([])).toEqual('')
    })
  })

  describe('listItem', () => {
    it('returns list item', () => {
      expect(listItem({label: 'item', value: 2})).toEqual('2 item')
    })

    it('returns list item with icon', () => {
      expect(listItem({icon: Icons.Heart, label: 'item', value: 2})).toEqual('2 ♥ item')
    })
  })

  describe('list', () => {
    it('returns empty string on empty list', () => {
      expect(list([])).toEqual('')
    })

    it('returns list item', () => {
      expect(list([{label: 'item', value: 2}])).toEqual('2 item')
    })

    it('returns all items with separator', () => {
      expect(list([{label: 'item', value: 2}, {icon: Icons.Heart, label: 'item', value: 2}])).toEqual('2 item · 2 ♥ item')
    })

    it('returns all items with separator filtering empty items', () => {
      expect(list([{label: 'item', value: 2}, {label: 'never', value: 0}, {icon: Icons.Heart, label: 'item', value: 2}])).toEqual('2 item · 2 ♥ item')
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

  describe('caption', () => {
    it('returns caption', () => {
      expect(caption(message)).toEqual(`${message}`)
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
