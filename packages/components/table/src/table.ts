import { buildProps } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'

import type Table from './table.vue'
import type { ExtractPropTypes } from 'vue'

export const tableProps = buildProps({
  /**
   * @description 表格尺寸
   */
  size: useSizeProp,
} as const)

export type TableProps = ExtractPropTypes<typeof tableProps>

export type TableInstance = InstanceType<typeof Table>
