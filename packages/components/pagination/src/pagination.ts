import { buildProps, isNumber } from '@m-eleplus-crud/utils'

import type { ExtractPropTypes } from 'vue'

export const paginationProps = buildProps({
  /**
   * @description 是否使用小型分页样式
   */
  small: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 是否为分页按钮添加背景色
   */
  background: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 总条目数
   */
  total: {
    type: Number,
    default: 0,
  },
  /**
   * @description  组件布局，子组件名用逗号分隔
   */
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  /**
   * @description 每页显示个数选择器的选项设置
   */
  pageSizes: {
    type: Array,
    default: () => [10, 50, 100, 200, 300, 400],
  },
  /**
   * @description 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 当前页数
   */
  currentPage: {
    type: Number,
    default: 1,
  },
  /**
   * @description 当前页大小
   */
  pageSize: {
    type: Number,
    default: 10,
  },
} as const)
export type PaginationProps = ExtractPropTypes<typeof paginationProps>

export const paginationEmits = {
  /**
   * 更新当前分页
   * @param page 页数
   * @returns
   */
  'update:currentPage': (page: number) => isNumber(page),
  /**
   * 更新页码大小
   * @param pageSize 页大小
   * @returns
   */
  'update:pageSize': (pageSize: number) => isNumber(pageSize),
  /**
   * 页数改变
   * @param page 页数
   * @returns
   */
  currentPage: (page: number) => isNumber(page),
  /**
   * 页码大小改变
   * @param pageSize 页码大小
   * @returns
   */
  pageSize: (pageSize: number) => isNumber(pageSize),
}
export type PaginationEmits = typeof paginationEmits
