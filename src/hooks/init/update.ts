import {Hook} from '@oclif/config'
import updateNotifier from 'update-notifier'

import pkg from '../../../package.json'
import {Alerts} from '../../utils/messages'
import {Logger, update} from '../../utils/renderer'

export const notify: Hook<'init'> = async function () {
  const {fav} = new Logger(this.log)
  const notifier = updateNotifier({pkg})

  if (notifier.update) {
    const {current, latest} = notifier.update
    fav(update({version: {current, latest}}), Alerts.Update)
  }
}
