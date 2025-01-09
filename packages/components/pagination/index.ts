import { withInstall } from '@m-eleplus-crud/utils'
import Pagination from './src/pagination.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MPagination: SFCWithInstall<typeof Pagination> = withInstall(Pagination)
export default MPagination

export * from './src/pagination'
export type { PaginationInstance } from './src/instance'
