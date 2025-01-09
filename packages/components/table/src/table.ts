import { buildProps, definePropType, isArray } from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'

import { ColumnType, ICommonColumn } from '../../common'

import type { ExtractPropTypes, VNode } from 'vue'

/**
 * @description 公开的table column配置
 */
export interface ITableCommonColumn {
  /**
   * @description 对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * @description 超出隐藏
   */
  overHidden?: boolean
  /**
   * @description 帮助信息文本
   */
  help?: string
  /**
   * @description 格式化内容
   * @param row 行数据
   * @param column 列信息
   * @param index 行索引
   * @returns
   */
  formatter?: (row: any, column: ITableColumn, index: number) => VNode | string
  /**
   * @description 列宽度
   */
  width?: number
  /**
   * @description 二维码宽度，默认70
   */
  qrcodeWidth?: number
  /**
   * @description 二维码高度，默认70
   */
  qrcodeHeight?: number
  /**
   * 一维码宽度，默认2
   */
  barcodeWith?: number
  /**
   * 一维码高度，默认50
   */
  barcodeHeight?: number
}

export interface ITableColumn extends ICommonColumn, ITableCommonColumn {
  /**
   * @description 类型
   */
  type?: ColumnType | 'index' | 'single' | 'selection'
}

/**
 * @description 公开的table配置
 */
export interface ITableCommonOption {
  /**
   * @description 是否显示操作栏
   */
  menu?: boolean
  /**
   * @description 是否为斑马纹
   */
  stripe?: boolean
  /**
   * @description 是否带有纵向边框
   */
  border?: boolean
  /**
   * @description 操作栏宽度
   */
  menuWidth?: number
  /**
   * @description 操作栏列冻结列 ，true 表示固定在左侧
   */
  menuFixed?: true | 'left' | 'right'
  /**
   * @description 操作栏按钮的对齐方式
   */
  menuAlign?: 'left' | 'center' | 'right'
  /**
   * @description 操作栏标题名称
   */
  menuTitle?: string
}

export interface ITableOption extends ITableCommonOption {
  /**
   * @description 列配置
   */
  column: ITableColumn[]
}

export const tableProps = buildProps({
  /**
   * @description 表格尺寸
   */
  size: useSizeProp,
  /**
   * @description 表格加载状态
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 表格数据
   */
  data: {
    required: true,
    type: Array,
  },
  /**
   * @description 选择数据
   */
  select: {
    required: false,
    type: Array,
  },
  /**
   * @description 配置信息
   */
  option: {
    type: definePropType<ITableOption>(Object),
    required: false,
  },
  /**
   * @description 权限配置
   */
  permission: {
    type: Object,
    default: {},
  },
  /**
   * @description 表格高度
   */
  height: {
    type: Number,
    required: false,
  },
  /**
   * @description 表格最大高度
   */
  maxHeight: {
    type: Number,
    required: false,
  },
} as const)

export type TableProps = ExtractPropTypes<typeof tableProps>

export const tableEmits = {
  'update:select': (arr: any[]) => isArray(arr),
  /**
   * 表格选择数据触发
   * @param arr 选择的数据
   * @returns
   */
  selectionChange: (arr: any[]) => isArray(arr),
}
export type TableEmits = typeof tableEmits
