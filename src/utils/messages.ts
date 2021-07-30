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
  descriptions: {
    add: () =>  'adds repository to local database',
    list: () => 'lists all repositories',
  },
  done: {
    add: (entity: Entities) => `${entity} has been successfully added`,
  },
  errors: {
    alreadyExist: (entity: Entities) => `${entity} already exists`,
    dirNotExist: () => 'Directory does not exist',
    notGitRepo: () => `Path is not a git ${Entities.Repo.toLowerCase()}`,
    pathNotDir: () => 'Path should be a directory',
    pathNotProvided: () => 'Path is not provided',
  },
  info: {
    addCommand: () => `You can use 'add' command to add a ${Entities.Repo.toLowerCase()}`,
    all: (entity: EntitiesPlural) => `All ${entity}:`,
    empty: (entity: EntitiesPlural) => `No ${entity} has been found`,
  },
}
