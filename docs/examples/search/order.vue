<script lang="ts" setup>
import { ref } from 'vue'
import type { ISearchOption } from 'm-eleplus-crud/index.ts'

const searchOption = ref<ISearchOption>({
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
      order: 1,
    },
  ],
})

const query = ref<any>({})

const search = () => {
  alert(JSON.stringify(query.value))
}

const reset = () => {}
</script>

<template>
  <div style="width: 100%">
    <MSearch
      :option="searchOption"
      :model="query"
      @search="search"
      @reset="reset"
    />
  </div>
</template>
