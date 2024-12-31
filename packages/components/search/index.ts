import { withInstall } from '@m-eleplus-crud/utils'
import Search from './src/search.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MSearch: SFCWithInstall<typeof Search> = withInstall(Search)
export default MSearch

export * from './src/search'
export type { SearchInstance } from './src/instance'
