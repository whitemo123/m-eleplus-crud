import { buildProps, isBoolean, isFunction } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'

import type { ExtractPropTypes } from 'vue'

export const dialogProps = buildProps({
  /**
   * @description 弹窗尺寸
   */
  size: useSizeProp,
  /**
   * @description 弹窗显示状态
   */
  modelValue: {
    type: Boolean,
    required: true,
  },
  /**
   * @description 弹窗标题
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * @description 弹窗宽度
   */
  width: {
    type: String,
    default: '600px',
  },
  /**
   * @description 顶部距离
   */
  top: {
    type: String,
    default: '15vh',
  },
  /**
   * @description 插入body
   */
  appendToBody: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 是否可以通过点击modal关闭Dialog
   */
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 是否可以通过按下ESC关闭Dialog
   */
  closeOnnPressEscape: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 弹窗关闭前回调
   */
  beforeClose: {
    type: Function,
  },
  /**
   * @description 为dialog开启拖拽功能
   */
  draggable: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 当关闭Dialog时，销毁其中的元素
   */
  destroyOnClose: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 保存按钮是否展示
   */
  saveBtn: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 取消按钮是否展示
   */
  cancelBtn: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 保存按钮文字
   */
  saveBtnText: {
    type: String,
    default: '',
  },
  /**
   * @description 保存按钮图标
   */
  saveBtnIcon: {
    type: String,
    default: 'CircleCheck',
  },
  /**
   * @description 取消按钮图标
   */
  cancelBtnIcon: {
    type: String,
    default: 'CircleClose',
  },
  /**
   * @description 取消按钮文字
   */
  cancelBtnText: {
    type: String,
    default: '',
  },
} as const)
export type DialogProps = ExtractPropTypes<typeof dialogProps>

export const dialogEmits = {
  /**
   * @description 更新弹窗状态
   * @param value 弹窗显示状态
   * @returns
   */
  'update:modelValue': (value: boolean) => isBoolean(value),
  /**
   * @description 弹窗关闭
   * @returns
   */
  close: () => true,
  /**
   * @description 弹窗取消
   * @returns
   */
  cancel: () => true,
  /**
   * @description 弹窗确认
   * @param done 完成
   * @param loading 加载完毕
   * @returns
   */
  enter: (done: () => void, loading: () => void) =>
    isFunction(done) && isFunction(loading),
}
export type DialogEmits = typeof dialogEmits
