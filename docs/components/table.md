# 列表 Table

_列表组件_

## 基础用法

<TableBasic />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud'

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
```

:::

## 索引

<TableIndex />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud'

const tableOption = ref<ITableOption>({
  border: true,
  column: [
    {
      type: 'index',
    },
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
```

:::

## 单选

<TableSingle />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud'

const tableOption = ref<ITableOption>({
  border: true,
  column: [
    {
      type: 'single',
      width: 50,
    },
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

const selectData = ref<any>([])
</script>

<template>
  <div style="width: 100%">
    <MTable
      v-model:select="selectData"
      :option="tableOption"
      :data="tableData"
    />
  </div>
</template>
```

:::
