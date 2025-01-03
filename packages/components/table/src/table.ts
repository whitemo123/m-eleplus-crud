import { buildProps, definePropType } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'

import type { ExtractPropTypes } from 'vue'

export interface ITableOption {
  /**
   * @description 是否显示操作栏
   */
  menu?: boolean
  /**
   * @description 是否为斑马纹
   */
  stripe?: boolean
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
   * @description 配置信息
   */
  option: {
    type: definePropType<ITableOption>(Object),
    required: false,
    default: () => ({
      // 默认显示操作栏
      menu: true,
      // 默认不显示斑马纹
      stripe: false,
    }),
  },
} as const)

export type TableProps = ExtractPropTypes<typeof tableProps>
