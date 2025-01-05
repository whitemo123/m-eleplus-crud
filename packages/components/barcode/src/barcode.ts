import { buildProps, isString } from '@m-eleplus-crud/utils'

import type { ExtractPropTypes } from 'vue'

export const barcodeProps = buildProps({
  /**
   * @description 一维码内容
   */
  text: {
    type: String,
    required: true,
  },
  /**
   * @description 宽度
   */
  barcodeWidth: {
    type: Number,
    default: 2,
  },
  /**
   * @description 高度
   */
  barcodeHeight: {
    type: Number,
    default: 50,
  },
} as const)
export type BarcodeProps = ExtractPropTypes<typeof barcodeProps>

export const barcodeEmits = {
  click: (val: string) => isString(val),
}
export type BarcodeEmits = typeof barcodeEmits
