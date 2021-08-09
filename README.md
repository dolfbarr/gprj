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
$ gprj (-v|--version|version)
gprj/0.6.4 darwin-x64 node-v14.17.3
$ gprj --help [COMMAND]
USAGE
  $ gprj COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gprj add`](#gprj-add)
* [`gprj help [COMMAND]`](#gprj-help-command)
* [`gprj list`](#gprj-list)
* [`gprj remove`](#gprj-remove)

## `gprj add`

adds repository to local database

```
USAGE
  $ gprj add

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ gprj add /path/to/repo
          ✔ done  Repository has been successfully added
```

_See code: [src/commands/add.ts](https://github.com/dolfbarr/gprj/blob/v0.6.4/src/commands/add.ts)_

## `gprj help [COMMAND]`

display help for gprj

```
USAGE
  $ gprj help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `gprj list`

lists all repositories

```
USAGE
  $ gprj list

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ gprj ls

EXAMPLE
  $ gprj list

          All repositories:

            1. gprj (main)
```

_See code: [src/commands/list.ts](https://github.com/dolfbarr/gprj/blob/v0.6.4/src/commands/list.ts)_

## `gprj remove`

removes repository from local database

```
USAGE
  $ gprj remove

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ gprj rm

EXAMPLE
  $ gprj remove /path/to/repo @2 repo
          ✔ done  All repositories have been successfully removed
```

_See code: [src/commands/remove.ts](https://github.com/dolfbarr/gprj/blob/v0.6.4/src/commands/remove.ts)_
<!-- commandsstop -->

# Thanks
- GPRJ is inspired a lot by [gita](https://github.com/nosarthur/gita) and [taskbook](https://github.com/klaussinani/taskbook).
- The project is built upon many libs and thanks all the authors!
- Another round of thanks to all the contributors!

# License

Released under [the MIT license](LICENSE).
