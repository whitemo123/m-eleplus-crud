import { INSTALLED_KEY } from '@m-eleplus-crud/constants'
import { provideGlobalConfig } from '@m-eleplus-crud/components/config-provider'
import { version } from './version'

import type { App, Plugin } from '@vue/runtime-core'
import type { ConfigProviderContext } from '@m-eleplus-crud/components/config-provider'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))

    if (options) provideGlobalConfig(options, app, true)
  }

  return {
    version,
    install,
  }
}
