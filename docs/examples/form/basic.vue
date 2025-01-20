<script lang="ts" setup>
import { ref } from 'vue'
import type { IFormOption } from 'm-eleplus-crud/index.ts'

const formOption = ref<IFormOption>({
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
    {
      label: '生日',
      prop: 'birthday',
      type: 'daterange',
    },
  ],
})

const modelForm = ref<any>({})
</script>

<template>
  <div style="width: 100%">
    <MForm :option="formOption" :model="modelForm" />
  </div>
</template>
