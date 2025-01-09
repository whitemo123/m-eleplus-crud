import { buildProps, definePropType } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'
import type { ExtractPropTypes } from 'vue'
import type { Language } from '@m-eleplus-crud/locale'

/**
 * @description 全局配置属性
 */
export const configProviderProps = buildProps({
  /**
   * @description 国际化配置
   */
  locale: {
    type: definePropType<Language>(Object),
  },
  /**
   * @description 组件尺寸
   */
  size: useSizeProp,
  /**
   * @description 表格高度调节(px)
   */
  calcHeight: {
    type: Number,
    required: false,
  },
  /**
   * @description 外部传递的http get请求函数
   */
  httpGet: {
    type: Function,
    required: false,
  },
} as const)

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
