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
} as const)

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
