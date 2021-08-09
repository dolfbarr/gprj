import chalk, {Chalk} from 'chalk'
import * as figures from 'figures'

import {getRepoStatus, RepoStatus, Statuses} from './helpers'
import {Alerts} from './messages'

export const TAB = 2
export const SPACE = ' '
export const NIL = ''

export const SEPARATOR = '·'

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
  Diverged='diverged',
  Stash='stash',
  Modified='modified',
  Conflicted='conflicted',

  // Misc
  ArrowRight='arrowRight'
}

export interface Icon {
  icon: string;
  style: Chalk;
  label?: string;
}

export const getIcon = (type: Icons, label?: string): string => {
  const ICONS = {
    [Icons.Success]: {
      icon: figures.tick,
      style: chalk.green,
    },
    [Icons.Info]: {
      icon: figures.info,
      style: chalk.blue,
    },
    [Icons.Warning]: {
      icon: figures.warning,
      style: chalk.yellow,
    },
    [Icons.Fail]: {
      icon: figures.cross,
      style: chalk.red,
    },
    [Icons.Heart]: {
      icon: figures.heart,
      style: chalk.yellow,
    },

    // Git related
    [Icons.Ahead]: {
      icon: figures.arrowUp,
      style: chalk.green,
    },
    [Icons.Behind]: {
      icon: figures.arrowDown,
      style: chalk.red,
    },
    [Icons.Diverged]: {
      icon: figures.warning, // as soon as we going to use binary file to start the app, we should change it as soon as we will be able to use figures 4.0+
      style: chalk.yellow,
    },
    [Icons.Stash]: {
      icon: '$',
      style: chalk.cyan,
    },
    [Icons.Modified]: {
      icon: '*',
      style: chalk.green,
    },
    [Icons.Conflicted]: {
      icon: '*',
      style: chalk.red,
    },

    // Misc
    [Icons.ArrowRight]: {
      icon: figures.arrowRight,
      style: chalk.reset,
    },
  } as {[x in Icons]: Icon}
  const icon = ICONS[type]

  return icon.style(icon.icon + (label ? SPACE + chalk.underline(label) : NIL))
}

export const getStatuses = ({status, stash}: Pick<Statuses, 'status' | 'stash'>): string => {
  const currentStatuses = []
  const getAheadBehind = (status: Statuses['status']): string => {
    switch (getRepoStatus(status)) {
    case RepoStatus.Ahead:
      return getIcon(Icons.Ahead)
    case RepoStatus.Behind:
      return getIcon(Icons.Behind)
    case RepoStatus.Diverged:
      return getIcon(Icons.Diverged)
    case RepoStatus.None:
      return SPACE
    }
  }
  const getStash = (stash: number) => {
    if (stash > 0) {
      return getIcon(Icons.Stash)
    }

    return SPACE
  }

  currentStatuses.push(getStash(stash))
  currentStatuses.push(getAheadBehind(status))

  return currentStatuses.join(NIL)
}

export const getModified = (modified: number, conflicted?: number) => {
  if (modified > 0) {
    return Number(conflicted) > 0 ? getIcon(Icons.Conflicted) : getIcon(Icons.Modified)
  }
  return NIL
}

export interface ListItem {
  icon?: Icons;
  label: string;
  value: number;
}

export const listItem = ({icon, label, value}: ListItem): string | null => {
  return value ? `${chalk.bold(value)}${padding(icon ? getIcon(icon) : NIL, {end: icon && INDEX_PADDING, start: INDEX_PADDING})}${chalk.dim(label)}` : null
}

export const list = (items: ListItem[]): string => {
  return items
  .map(item => listItem(item))
  .filter(item => item !== null && item !== NIL)
  .join(padding(SEPARATOR, {end: INDEX_PADDING, start: INDEX_PADDING}))
}

export interface UpdateInfo {
  version: {
    current: string;
    latest: string;
  };
}

export const update = ({version: {current, latest}}: UpdateInfo) =>
  `Update available: ${chalk.dim(current)} ${getIcon(Icons.ArrowRight)} ${chalk.green(latest)}`

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

  caption = (message: string) => this.render(chalk.gray(message), 0)

  empty = (message?: string) => this.render(message || NIL, 0)

  notification = (message: string, icon?: Icons, label?: string): string =>
    this.render(padding(icon ? getIcon(icon, label) : NIL, {end: NOTIFICATION_ICON_PADDING}) + message)

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
