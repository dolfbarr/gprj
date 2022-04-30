GPRJ
====

Clean &amp; simple CLI git multi project manager

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gprj.svg)](https://npmjs.org/package/gprj)
[![Downloads/week](https://img.shields.io/npm/dw/gprj.svg)](https://npmjs.org/package/gprj)
[![License](https://img.shields.io/npm/l/gprj.svg)](https://github.com/dolfbarr/gprj/blob/master/package.json)
[![Test](https://github.com/dolfbarr/gprj/actions/workflows/push.yaml/badge.svg?branch=main&event=push)](https://github.com/dolfbarr/gprj/actions/workflows/push.yaml)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Thanks](#thanks)
* [License](#license)
<!-- tocstop -->

# Installation

```sh
$ npm install gprj -g
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g gprj
$ gprj COMMAND
running command...
$ gprj (--version|-v)
gprj/1.0.1 darwin-x64 node-v14.17.3
$ gprj --help [COMMAND]
USAGE
  $ gprj COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gprj add`](#gprj-add)
* [`gprj list`](#gprj-list)
* [`gprj ls`](#gprj-ls)
* [`gprj r`](#gprj-r)
* [`gprj raw`](#gprj-raw)
* [`gprj remove`](#gprj-remove)
* [`gprj rm`](#gprj-rm)
* [`gprj version`](#gprj-version)

## `gprj add`

adds repository to local database

```
USAGE
  $ gprj add [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  adds repository to local database

EXAMPLES
  $ gprj add /path/to/repo
   ✔ done  Repository has been successfully added
```

_See code: [dist/commands/add.ts](https://github.com/dolfbarr/gprj/blob/v1.0.1/dist/commands/add.ts)_

## `gprj list`

lists all repositories

```
USAGE
  $ gprj list [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  lists all repositories

ALIASES
  $ gprj ls

EXAMPLES
  $ gprj list
  All repositories:
   1. gprj (main)
```

_See code: [dist/commands/list.ts](https://github.com/dolfbarr/gprj/blob/v1.0.1/dist/commands/list.ts)_

## `gprj ls`

lists all repositories

```
USAGE
  $ gprj ls [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  lists all repositories

ALIASES
  $ gprj ls

EXAMPLES
  $ gprj list
  All repositories:
   1. gprj (main)
```

## `gprj r`

execute a shell command in repo path

```
USAGE
  $ gprj r -x <value> [-h] [-t <value>]

FLAGS
  -h, --help             Show CLI help.
  -t, --timeout=<value>  [default: 5000] timeout in ms
  -x, --execute=<value>  (required) command to execute

DESCRIPTION
  execute a shell command in repo path

ALIASES
  $ gprj r

EXAMPLES
  $ gprj raw  /path/to/repo1 /path/to/repo2 --execute='yarn test' --timeout=2000
   ✔ repo1
   ✔ repo2
   ✔ done  All commands has been successfully executed
```

## `gprj raw`

execute a shell command in repo path

```
USAGE
  $ gprj raw -x <value> [-h] [-t <value>]

FLAGS
  -h, --help             Show CLI help.
  -t, --timeout=<value>  [default: 5000] timeout in ms
  -x, --execute=<value>  (required) command to execute

DESCRIPTION
  execute a shell command in repo path

ALIASES
  $ gprj r

EXAMPLES
  $ gprj raw  /path/to/repo1 /path/to/repo2 --execute='yarn test' --timeout=2000
   ✔ repo1
   ✔ repo2
   ✔ done  All commands has been successfully executed
```

_See code: [dist/commands/raw.ts](https://github.com/dolfbarr/gprj/blob/v1.0.1/dist/commands/raw.ts)_

## `gprj remove`

removes repository from local database

```
USAGE
  $ gprj remove [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  removes repository from local database

ALIASES
  $ gprj rm

EXAMPLES
  $ gprj remove /path/to/repo @2 repo
   ✔ done  All repositories have been successfully removed
```

_See code: [dist/commands/remove.ts](https://github.com/dolfbarr/gprj/blob/v1.0.1/dist/commands/remove.ts)_

## `gprj rm`

removes repository from local database

```
USAGE
  $ gprj rm [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  removes repository from local database

ALIASES
  $ gprj rm

EXAMPLES
  $ gprj remove /path/to/repo @2 repo
   ✔ done  All repositories have been successfully removed
```

## `gprj version`

```
USAGE
  $ gprj version
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.0.4/src/commands/version.ts)_
<!-- commandsstop -->

# Thanks
- GPRJ is inspired a lot by [gita](https://github.com/nosarthur/gita) and [taskbook](https://github.com/klaussinani/taskbook).
- The project is built upon many libs and thanks all the authors!
- Another round of thanks to all the contributors!

# License

Released under [the MIT license](LICENSE).
