import {
  buildProps,
  definePropType,
  isArray,
  isObject,
} from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'
import type { ExtractPropTypes } from 'vue'
import type {
  IFormCommonColumn,
  IFormCommonOption,
  ISearchCommonColumn,
  ISearchCommonOption,
  ITableCommonColumn,
  ITableCommonOption,
} from '@m-eleplus-crud/m-eleplus-crud'
import type { FormItemRule } from 'element-plus'

export interface ICrudColumn
  extends ITableCommonColumn,
    IFormCommonColumn,
    ISearchCommonColumn {
  /**
   * @description 搜索排序
   */
  searchOrder?: number
  /**
   * @description 表单排序
   */
  formOrder?: number
  /**
   * @description 是否开启搜索
   */
  search?: boolean
  /**
   * @description 搜索默认值
   */
  searchValue?: any
  /**
   * @description 表单默认值
   */
  formValue?: any
  /**
   * @description 搜索占位文本
   */
  searchPlaceholder?: string
  /**
   * @description 表单占位文本
   */
  formPlaceholder?: string
  /**
   * @description 搜索校验规则
   */
  searchRules?: FormItemRule[]
  /**
   * @description 表单校验规则
   */
  formRules?: FormItemRule[]
  /**
   * @description 列表是否显示
   */
  hide?: boolean
  /**
   * @description 新增对话框是否显示
   */
  addHide?: boolean
  /**
   * @description 查看对话框是否显示
   */
  viewHide?: boolean
  /**
   * @description 编辑对话框是否显示
   */
  editHide?: boolean
  /**
   * @description 搜索项框栅列
   */
  searchSpan?: number
  /**
   * @description 新增项框栅列
   */
  addSpan?: number
  /**
   * @description 编辑项框栅列
   */
  editSpan?: number
  /**
   * @description 查看项框栅列
   */
  viewSpan?: number
  /**
   * @description 表单项框栅列
   */
  formSpan?: number
}

/**
 * @description crud配置
 */
export interface ICrudOption
  extends ITableCommonOption,
    IFormCommonOption,
    ISearchCommonOption {
  /**
   * @description 新增按钮是否需要
   */
  addBtn?: boolean
  /**
   * @description 编辑按钮是否需要
   */
  editBtn?: boolean
  /**
   * @description 删除按钮是否需要
   */
  delBtn?: boolean
  /**
   * @description 新增按钮文字
   */
  addBtnText?: string
  /**
   * @description 新增按钮图标
   */
  addBtnIcon?: string
  /**
   * @description 搜索label宽度
   */
  searchLabelWidth?: string
  /**
   * @description 表单label宽度
   */
  formLabelWidth?: string
  /**
   * @description 新增弹窗标题
   */
  addDialogTitle?: string
  /**
   * @description 编辑弹窗标题
   */
  editDialogTitle?: string
  /**
   * @description 查看弹窗标题
   */
  viewDialogTitle?: string
  /**
   * @description 弹窗宽度
   */
  dialogWidth?: string
  /**
   * @description 表格高度
   */
  height?: string
  /**
   * @description 表格最大高度
   */
  maxHeight?: string
  /**
   * @description 表格高度调节(px)
   */
  calcHeight?: number
  /**
   * @description crud列配置
   */
  column: ICrudColumn[]
}

export const crudProps = buildProps({
  /**
   * @description 组件尺寸大小
   */
  size: useSizeProp,
  /**
   * @description 加载状态
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 表格数据
   */
  data: {
    type: Array,
    required: true,
  },
  /**
   * @description 搜索参数
   */
  search: {
    type: Object,
    default: () => ({}),
  },
  /**
   * @description 数据总数
   */
  total: {
    type: Number,
    default: 0,
  },
  /**
   * @description 表单绑定的值
   */
  modelValue: {
    type: Object,
    required: true,
  },
  /**
   * @description 权限配置
   */
  permission: {
    type: Object,
    default: () => ({
      // 新增按钮权限
      addBtn: true,
      // 编辑按钮权限
      editBtn: true,
      // 删除按钮权限
      delBtn: true,
    }),
  },
  /**
   * @description 选择的数据
   */
  select: {
    type: Array,
    default: () => [],
  },
  /**
   * @description 表单提交前
   */
  beforeEnter: {
    type: Function,
  },
  /**
   * @description crud配置项
   */
  option: {
    type: definePropType<ICrudOption>(Object),
    required: false,
  },
} as const)
export type CrudProps = ExtractPropTypes<typeof crudProps>

export const crudEmits = {
  /**
   * @description 更新选择数据
   * @param arr 选择的数据
   * @returns
   */
  'update:select': (arr: any[]) => isArray(arr),
  /**
   * @description 更新表单数据
   * @param value  表单数据
   * @returns
   */
  'update:modelValue': (value: any) => isObject(value),
}
export type CrudEmits = typeof crudEmits
