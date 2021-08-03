/* istanbul ignore file */

import {SimpleGit} from 'simple-git'

export const checkIsRepo = async (git: SimpleGit) => git.checkIsRepo()
export const branch = async (git: SimpleGit) => git.branch()
export const status = async (git: SimpleGit) => git.status()
export const stashList = async (git: SimpleGit) => git.stashList()
