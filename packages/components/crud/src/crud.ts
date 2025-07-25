import {
  buildProps,
  definePropType,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString,
} from '@m-eleplus-crud/utils'
import { useSizeProp } from '@m-eleplus-crud/hooks'
import { ColumnType, ICommonColumn } from '../../common'
import type { ExtractPropTypes } from 'vue'
import type { FormItemRule } from 'element-plus'
import type { ITableCommonColumn, ITableCommonOption } from '../../table'
import type { ISearchCommonColumn, ISearchCommonOption } from '../../search'
import type { IFormCommonColumn, IFormCommonOption } from '../../form'

// crud不需要继承form的column属性
type WithoutFormColumn = Omit<
  IFormCommonColumn,
  'order' | 'value' | 'placeholder' | 'rules' | 'span' | 'labelWidth'
>
// crud不需要继承search的column属性
type WithoutSearchColumn = Omit<
  ISearchCommonColumn,
  'order' | 'value' | 'placeholder' | 'rules' | 'span' | 'labelWidth'
>

export interface ICrudCommonColumn
  extends ICommonColumn,
  ITableCommonColumn,
  // IFormCommonColumn,
  // ISearchCommonColumn,
  WithoutFormColumn,
  WithoutSearchColumn {
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
   * @description 搜索标签宽度
   */
  searchLabelWidth?: string
  /**
   * @description 表单标签宽度
   */
  formLabelWidth?: string
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
  /**
   * @description 新增表单禁用
   */
  addDisabled?: boolean
  /**
   * @description 编辑表单禁用
   */
  editDisabled?: boolean
}

export interface ICrudColumn extends ICrudCommonColumn {
  type?: ColumnType | 'index' | 'single' | 'selection'
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
  /**
   * 查询事件触发
   * @param form 查询表单数据
   * @returns
   */
  search: (form: any) => isObject(form),
  /**
   * 重置事件触发
   * @returns
   */
  reset: () => true,
  /**
   * 新增
   * @param form 表单数据
   * @param done 完成
   * @param loading 加载
   * @returns
   */
  rowSave: (form: any, done: () => void, loading: () => void) =>
    isObject(form) && isFunction(done) && isFunction(loading),
  /**
   * 编辑
   * @param form 表单数据
   * @param done 完成
   * @param loading 加载
   * @returns
   */
  rowEdit: (form: any, done: () => void, loading: () => void) =>
    isObject(form) && isFunction(done) && isFunction(loading),

  /**
   * 取消
   * @param form 表单数据
   * @param index 索引
   * @param type 类型
   * @returns
   */
  rowCancel: (form: any, index: number, type: 'add' | 'edit' | 'view') =>
    isObject(form) && isNumber(index) && isString(type),

  /**
   * 删除
   * @param row 行数据
   * @param index 索引
   * @returns
   */
  rowDel: (row: any, index: number) => isObject(row) && isNumber(index),
}
export type CrudEmits = typeof crudEmits
