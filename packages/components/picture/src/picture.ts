import { buildProps } from '@m-eleplus-crud/utils'

import type { ExtractPropTypes } from 'vue'

export const pictureProps = buildProps({
  /**
   * @description 图片url资源
   */
  src: {
    type: String,
    required: true,
  },
  /**
   * @description 预览图片url资源集合
   */
  previewSrcList: {
    type: Array,
    required: true,
  },
  /**
   * @description 图片宽度
   */
  imgWidth: {
    type: String,
    default: '70px',
  },
  /**
   * @description 图片高度
   */
  imgHeight: {
    type: String,
    default: '70px',
  },
} as const)
export type PictureProps = ExtractPropTypes<typeof pictureProps>

export const pictureEmits = {}
export type PictureEmits = typeof pictureEmits
