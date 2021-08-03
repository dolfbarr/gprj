import chalk, {Chalk} from 'chalk'
import * as figures from 'figures'

import {Alerts} from './messages'

export const TAB = 2
export const SPACE = ' '
export const NIL = ''

export const NOTIFICATION_ICON_PADDING = 2
export const INDEX_PADDING = 1

export const padding = (message: string, paddings?: {start?: number; end?: number}): string => {
  const result = message.padStart(message.length + (paddings?.start || 0), SPACE)
  return result.padEnd(result.length + (paddings?.end || 0), SPACE)
}

export enum Icons {
  Success='success',
  Info='info',
  Fail='fail',
  Warning='warning',
  Heart='heart',

  // Git related
  Ahead='ahead',
  Behind='behind',
  Diverged='diverged'
}

export interface Icon {
  icon: string;
  color: Chalk;
  label?: string;
}

export const getIcon = (type: Icons, label?: string): string => {
  const ICONS = {
    [Icons.Success]: {
      color: chalk.green,
      icon: figures.tick,
    },
    [Icons.Info]: {
      color: chalk.blue,
      icon: figures.info,
    },
    [Icons.Warning]: {
      color: chalk.yellow,
      icon: figures.warning,
    },
    [Icons.Fail]: {
      color: chalk.red,
      icon: figures.cross,
    },
    [Icons.Heart]: {
      color: chalk.yellow,
      icon: figures.heart,
    },

    // Git related
    [Icons.Ahead]: {
      color: chalk.green,
      icon: figures.arrowUp,
    },
    [Icons.Behind]: {
      color: chalk.red,
      icon: figures.arrowDown,
    },
    [Icons.Diverged]: {
      color: chalk.yellow,
      icon: figures.warning, // as soon as we going to use binary file to start the app, we should change it as soon as we will be able to use figures 4.0+
    },
  } as {[x in Icons]: Icon}
  const icon = ICONS[type]

  return icon.color(icon.icon + (label ? SPACE + chalk.underline(label) : NIL))
}

export interface Statuses {
  status: {ahead: number; behind: number};
}

export const getStatuses = ({status: {ahead, behind}}: Statuses): string => {
  const currentStatuses = []
  const getAheadBehind = (ahead: number, behind: number): string => {
    if (ahead && behind) return getIcon(Icons.Diverged)
    if (ahead && !behind) return getIcon(Icons.Ahead)
    if (!ahead && behind) return getIcon(Icons.Behind)

    return SPACE
  }

  currentStatuses.push(getAheadBehind(ahead, behind))

  return currentStatuses.join('')
}

export class Logger {
  logger: (m?: string) => any

  constructor(logger: (m?: string) => any) {
    this.logger = logger
  }

  render = (message: string, level = 1): string => {
    const renderedMessage = padding(message, {start: TAB * level})
    this.logger(renderedMessage)

    return renderedMessage
  }

  heading = (message: string) => this.render(chalk.bold(message), 0)

  empty = (message?: string) => this.render(message || '', 0)

  notification = (message: string, icon?: Icons, label?: string): string =>
    this.render(padding(icon ? getIcon(icon, label) : '', {end: NOTIFICATION_ICON_PADDING}) + message)

  done = (message: string, label?: string): string => this.notification(message, Icons.Success, label || Alerts.Done)

  fail = (message: string, label?: string): string => this.notification(message, Icons.Fail, label || Alerts.Fail)

  warn = (message: string, label?: string): string => this.notification(message, Icons.Warning, label || Alerts.Warn)

  info = (message: string, label?: string): string => this.notification(message, Icons.Info, label || Alerts.Info)

  fav = (message: string, label?: string): string => this.notification(message, Icons.Heart, label)

  line = (message: string, index?: number, indexPadding = 1): string => {
    return this.render(padding((index + '.').padStart(indexPadding, SPACE), {end: INDEX_PADDING}) + message)
  }

  lineAll = (list: string[]): string[] => {
    return list.map((item: string, index) => this.line(item, index + 1, list.length.toString().length + 1))
  }
}
