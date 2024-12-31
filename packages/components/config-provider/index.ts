import { withInstall } from '@m-eleplus-crud/utils'

import ConfigProvider from './src/config-provider'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MConfigProvider: SFCWithInstall<typeof ConfigProvider> =
  withInstall(ConfigProvider)
export default MConfigProvider

export * from './src/config-provider'
export * from './src/config-provider-props'
export * from './src/constants'
export * from './src/hooks/use-global-config'
