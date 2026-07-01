/* istanbul ignore file */

export enum Entities {
  Repo='Repository',
  Path='Path',
  Command='Command'
}

export enum EntitiesPlural {
  Repos='repositories',
  Paths='paths',
  Commands='commands',
}

export enum Alerts {
  Done='done',
  Fail='fail',
  Warn='warn',
  Info='info',

  Update='update'
}

export const messages = {
  descriptions: {
    add: () =>  'adds repository to local database',
    execute: () => 'command to execute',
    list: () => 'lists all repositories',
    raw: () => 'execute a shell command in repo path',
    remove: () => 'removes repository from local database',
    timeout: () => 'timeout in ms',
  },
  done: {
    add: (entity: Entities) => `${entity} has been successfully added`,
    addPlural: (entity: EntitiesPlural) => `All ${entity} have been successfully added`,
    execute: (entity: Entities) => `${entity} has been successfully executed`,
    executePlural: (entity: EntitiesPlural) => `All ${entity} have been successfully executed`,
    remove: (entity: Entities) => `${entity} has been successfully removed`,
    removePlural: (entity: EntitiesPlural) => `All ${entity} have been successfully removed`,
  },
  errors: {
    alreadyExist: (entity: Entities) => `${entity} already exists`,
    dirNotExist: () => 'Directory does not exist',
    notExist: (entity: Entities) => `${entity} does not exist`,
    notGitRepo: () => `Path is not a git ${Entities.Repo.toLowerCase()}`,
    notProvided: (entity: Entities) => `${entity} is not provided`,
    pathNotDir: () => 'Path should be a directory',
    timeout: () => 'Process has been canceled by timeout',
  },
  info: {
    addCommand: () => `You can use 'add' command to add a ${Entities.Repo.toLowerCase()}`,
    all: (entity: EntitiesPlural) => `All ${entity}:`,
    empty: (entity: EntitiesPlural) => `No ${entity} has been found`,
  },
}
