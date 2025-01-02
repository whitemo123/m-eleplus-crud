import { buildProps, definePropType } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'

import type { ExtractPropTypes } from 'vue'

export interface ITableOption {
  menu?: boolean
}

export const tableProps = buildProps({
  /**
   * @description 表格尺寸
   */
  size: useSizeProp,
  /**
   * @description 表格数据
   */
  data: {
    required: true,
    type: Array,
  },
  /**
   * @description 表格数据总数
   */
  total: {
    required: true,
    type: Number,
  },
  /**
   * @description 配置信息
   */
  option: {
    type: definePropType<ITableOption>(Object),
    required: true,
  },
} as const)

export type TableProps = ExtractPropTypes<typeof tableProps>
