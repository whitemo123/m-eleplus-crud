<script lang="ts" setup>
// import { useLocale } from '@m-eleplus-crud/hooks'
import { tableProps } from './table'

const COMPONENT_NAME = 'MTable'
defineOptions({
  name: COMPONENT_NAME,
})

defineProps(tableProps)

// const { t } = useLocale()
</script>

<template>
  <div class="m-table">
    <el-table style="width: 100%" :data="data">
      <el-table-column v-if="option.menu" label="操作" align="center" />
    </el-table>
  </div>
</template>
