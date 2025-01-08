import { withInstall } from '@m-eleplus-crud/utils'
import Crud from './src/crud.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MCrud: SFCWithInstall<typeof Crud> = withInstall(Crud)
export default MCrud

export * from './src/crud'
export type { CrudInstance } from './src/instance'
