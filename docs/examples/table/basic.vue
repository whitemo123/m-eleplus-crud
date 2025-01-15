<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud/index.ts'

const tableOption = ref<ITableOption>({
  border: true,
  column: [
    {
      label: '名字',
      prop: 'name',
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      dicData: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
    },
  ],
})

const tableData = ref([
  {
    name: 'ZhangSan',
    sex: 1,
  },
  {
    name: 'LiSi',
    sex: 2,
  },
])
</script>

<template>
  <div style="width: 100%">
    <MTable :option="tableOption" :data="tableData" />
  </div>
</template>
