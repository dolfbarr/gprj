/* istanbul ignore file */

export enum Entities {
  Repo='Repository',
  Path='Path',
}

export enum EntitiesPlural {
  Repos='repositories'
}

export enum Alerts {
  Done='done',
  Fail='fail',
  Warn='warn',
  Info='info',
}

export const messages = {
  descriptions: {
    add: () =>  'adds repository to local database',
    list: () => 'lists all repositories',
    remove: () => 'removes repository from local database',
  },
  done: {
    add: (entity: Entities) => `${entity} has been successfully added`,
    addPlural: (entity: EntitiesPlural) => `All ${entity} have been successfully added`,
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
  },
  info: {
    addCommand: () => `You can use 'add' command to add a ${Entities.Repo.toLowerCase()}`,
    all: (entity: EntitiesPlural) => `All ${entity}:`,
    empty: (entity: EntitiesPlural) => `No ${entity} has been found`,
  },
}
