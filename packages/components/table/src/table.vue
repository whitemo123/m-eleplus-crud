<script lang="ts" setup>
import { useLocale } from '@m-eleplus-crud/hooks'
import { tableProps } from './table'

const COMPONENT_NAME = 'MTable'
defineOptions({
  name: COMPONENT_NAME,
})

defineProps(tableProps)

const { t } = useLocale()
</script>

<template>
  <div class="m-table">
    <el-table style="width: 100%" :data="data">
      <el-table-column
        v-if="option.menu"
        :label="t('m.table.menuTitle')"
        align="center"
      >
        <template #default="{ row, $index }"> {{ $index }}{{ row }} </template>
      </el-table-column>
    </el-table>
  </div>
</template>
