export enum Entities {
  Repo='Repository',
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
  descriptions: {
    add: () =>  'Adds repository to local database',
    hello: () => 'Test temporary command',
  },
}
