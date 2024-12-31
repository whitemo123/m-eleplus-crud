import { buildProps } from '@m-eleplus-crud/utils'

import type { ExtractPropTypes } from 'vue'

export const searchProps = buildProps({} as const)
export type SearchProps = ExtractPropTypes<typeof searchProps>

export const searchEmits = {}
export type SearchEmits = typeof searchEmits
