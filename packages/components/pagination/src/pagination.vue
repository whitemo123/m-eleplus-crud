<script lang="ts" setup>
import { paginationEmits, paginationProps } from './pagination'

const COMPONENT_NAME = 'MPagination'
defineOptions({
  name: COMPONENT_NAME,
})

defineProps(paginationProps)

const emits = defineEmits(paginationEmits)

/**
 * 页数变化
 * @param size 页大小
 */
const handleSizeChange = (size: number) => {
  emits('update:pageSize', size)
  emits('pageSize', size)
}

/**
 * 页发生变化
 * @param page 页
 */
const handleCurrentChange = (page: number) => {
  emits('update:currentPage', page)
  emits('currentPage', page)
}
</script>

<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :small="small"
    :disabled="disabled"
    :background="background"
    :layout="layout"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
