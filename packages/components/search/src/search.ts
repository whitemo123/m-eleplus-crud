import { ICommonColumn } from '@m-eleplus-crud/components/common'
import { useSizeProp } from '@m-eleplus-crud/hooks'
import { buildProps, definePropType, isObject } from '@m-eleplus-crud/utils'

import { ColumnType } from '../../common'
import type { ExtractPropTypes } from 'vue'
import type { FormItemRule } from 'element-plus'

/**
 * @description 搜索列配置
 */
export interface ISearchColumn extends ICommonColumn {
  /**
   * @description label宽度
   */
  labelWidth?: string
  /**
   * @description 搜索排序
   */
  order?: number
  /**
   * @description 搜索校验规则
   */
  rules?: FormItemRule[]
  /**
   * @description 栅栏宽度
   */
  span?: number
  /**
   * @description 最大长度
   */
  maxlength?: number
  /**
   * @description 搜索默认值
   */
  value?: any
  /**
   * @description 输入框占位文本
   */
  placeholder?: string
  /**
   * @description 类型
   */
  type?: ColumnType
}

/**
 * @description 搜索信息配置
 */
export interface ISearchOption {
  /**
   * @description 搜索按钮文本
   */
  searchBtnText?: string
  /**
   * @description 重置按钮文本
   */
  resetBtnText?: string
  /**
   * @description 搜索按钮icon
   */
  searchBtnIcon?: string
  /**
   * @description 重置按钮icon
   */
  resetBtnIcon?: string
  /**
   * @description label宽度
   */
  labelWidth?: string
  /**
   * @description 收缩展示个数
   */
  colIndex?: number
  /**
   * @description 是否开启收缩
   */
  col?: boolean
  /**
   * @description 搜索列配置
   */
  column?: ISearchColumn[]
}

export const searchProps = buildProps({
  /**
   * @description 尺寸大小
   */
  size: useSizeProp,
  /**
   * @description 查询加载状态
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 搜索权限配置
   */
  permission: {
    type: Object,
    default: {},
  },
  /**
   * @description 搜索表单数据
   */
  model: {
    type: Object,
    required: true,
  },
  /**
   * @description 搜索配置
   */
  option: {
    type: definePropType<ISearchOption>(Object),
    required: false,
  },
} as const)
export type SearchProps = ExtractPropTypes<typeof searchProps>

export const searchEmits = {
  /**
   * 搜索
   * @param model 搜索表单数据
   * @returns
   */
  search: (model: any) => isObject(model),
  /**
   * 重置
   * @returns
   */
  reset: () => true,
}
export type SearchEmits = typeof searchEmits
