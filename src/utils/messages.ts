/* istanbul ignore file */
export enum Entities {
  Repo='Repository'
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
  errors: {
    pathNotProvided: () => 'Path is not provided',
    dirNotExist: () => 'Directory does not exist',
    pathNotDir: () => 'Path should be a directory',
    alreadyExist: (entity: Entities) => `${entity} already exists`,
  },
  done: {
    add: (entity: Entities) => `${entity} has been successfully added`,
  },
  info: {
    empty: (entity: EntitiesPlural) => `No ${entity} has been found`,
    addCommand: () => `You can use 'add' command to add a ${Entities.Repo.toLowerCase()}`,
    all: (entity: EntitiesPlural) => `All ${entity}:`,
  },
  descriptions: {
    add: () =>  'Adds repository to local database',
    hello: () => 'Test temporary command',
    list: () => 'Lists all current repositories',
  },
}
