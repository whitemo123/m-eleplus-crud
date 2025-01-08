import { useSizeProp } from '@m-eleplus-crud/hooks'
import { buildProps, definePropType } from '@m-eleplus-crud/utils'

import type {
  ColumnType,
  ICommonColumn,
} from '@m-eleplus-crud/components/common'
import type { FormItemRule } from 'element-plus'

import type { ExtractPropTypes } from 'vue'

/**
 * @description 公开的form column配置
 */
export interface IFormCommonColumn {
  /**
   * 表单校验规则
   */
  rules?: FormItemRule[]
  /**
   * @description 单个标签宽度
   */
  labelWidth?: string
  /**
   * @description 表单排序
   */
  order?: number
  /**
   * @description 栅栏宽度
   */
  span?: number
  /**
   * @description 最大长度
   */
  maxlength?: number
  /**
   * @description 是否显示字数统计，仅对type为textarea有效
   */
  showWordLimit?: boolean
  /**
   * @description 是否显示密码切换按钮，仅对type为password有效
   */
  showPassword?: boolean
  /**
   * @description 默认值
   */
  value?: any
  /**
   * @description 占位文本
   */
  placeholder?: string
}

export interface IFormColumn extends ICommonColumn, IFormCommonColumn {
  /**
   * @description 组件类型
   */
  type?: ColumnType
}

/**
 * @description 公开的form配置
 */
export interface IFormCommonOption {
  /**
   * @description 标签宽度
   */
  labelWidth?: string
}

export interface IFormOption extends IFormCommonOption {
  /**
   * @description 表单列
   */
  column: IFormColumn[]
}

export const formProps = buildProps({
  /**
   * @description 组件大小
   */
  size: useSizeProp,
  /**
   * @description 表单绑定的数据
   */
  model: {
    type: Object,
    required: true,
  },
  /**
   * @description 表单加载状态
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 表单权限配置
   */
  permission: {
    type: Object,
    default: {},
  },
  /**
   * @description 是否只读
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 表单配置
   */
  option: {
    type: definePropType<IFormOption>(Object),
    required: false,
  },
} as const)
export type FormProps = ExtractPropTypes<typeof formProps>

export const formEmits = {}
export type FormEmits = typeof formEmits
