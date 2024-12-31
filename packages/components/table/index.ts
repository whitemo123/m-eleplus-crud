import { withInstall } from '@m-eleplus-crud/utils'
import Table from './src/table.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'
export const MTable: SFCWithInstall<typeof Table> = withInstall(Table)
export default MTable

export * from './src/table'
export type { TableInstance } from './src/instance'
