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

## 多选

<TableMultiple />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud'

const tableOption = ref<ITableOption>({
  border: true,
  column: [
    {
      type: 'selection',
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

## 自定义列

<TableSlot />

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
    <MTable :option="tableOption" :data="tableData">
      <template #sex="{ row, $index }">
        <span>有没有第三种性别</span>
      </template>
    </MTable>
  </div>
</template>
```

:::

## 操作栏自定义

<TableMenuSlot />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ITableOption } from 'm-eleplus-crud'

const tableOption = ref<ITableOption>({
  border: true,
  menu: true,
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

const selectData = ref<any>([])
</script>

<template>
  <div style="width: 100%">
    <MTable v-model:select="selectData" :option="tableOption" :data="tableData">
      <template #menu="{ row, $index }">
        <el-link type="primary" :underline="false">自定义</el-link>
      </template>
    </MTable>
  </div>
</template>
```

:::

## Table API

### Table Attributes

| 属性名         | 说明         | 类型                                    | 默认值 |
| :------------- | :----------- | :-------------------------------------- | :----- |
| size           | 组件尺寸     | `default` &#124; `small` &#124; `large` | --     |
| loading        | 加载状态     | `boolean`                               | false  |
| permission     | 权限对象     | `object`                                | {}     |
| data           | 表格数据     | `array`                                 | []     |
| v-model:select | 表格选择数据 | `array`                                 | []     |
| height         | 表格高度     | `number`                                | --     |
| maxHeight      | 表格高度     | `number`                                | --     |
| option         | 表格配置     | `ITableOption`                          | --     |

### Table 事件

| 名称            | 说明         | 类型                   |
| :-------------- | :----------- | :--------------------- |
| selectionChange | 表格选择触发 | `(arr: any[]) => void` |

### Table 插槽

| 名称    | 说明          | 值              |
| :------ | :------------ | :-------------- |
| prop 值 | prop 属性的值 | `{row, $index}` |
| menu    | 操作栏插槽    | `{row, $index}` |

### Table Exposes

| 名称               | 说明                                                                        | 类型                                                       |
| :----------------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------- |
| clearSelection     | 清空表格选择数据                                                            | `() => void`                                               |
| toggleRowSelection | 切换某行数据选择状态(index:列表索引，selected:是否选择，type:1 单选/2 多选) | `(index: number, selected: boolean, type: number) => void` |
| refreshTable       | 刷新表格(重新渲染表格，不是刷新数据)                                        | `() => void`                                               |

### 额外类型

#### ITableOption

| 属性名    | 说明                                 | 类型                                               | 默认值   |
| :-------- | :----------------------------------- | :------------------------------------------------- | :------- |
| menu      | 是否显示操作列                       | `boolean`                                          | false    |
| stripe    | 是否显示斑马纹                       | `boolean`                                          | false    |
| border    | 是否显示纵向边框                     | `boolean`                                          | false    |
| menuWidth | 操作栏宽度                           | `number`                                           | 220      |
| menuFixed | 操作栏列冻结列 ，true 表示固定在左侧 | `true` &#124; `'left'` &#124; `'right'`            | 'right'  |
| menuAlign | 操作栏按钮的对齐方式                 | `'left'` &#124; `'center'` &#124; `'right'` &#124; | 'center' |
| menuTitle | 操作栏标题名称                       | `string`                                           | '操作'   |
| column    | 配置项                               | `ITableColumn[]`                                   | []       |

#### ITableColumn

| 属性名       | 说明                               | 类型                                                          | 默认值 |
| :----------- | :--------------------------------- | :------------------------------------------------------------ | :----- |
| label        | 标题                               | `string`                                                      | --     |
| prop         | 字段名                             | `string`                                                      | --     |
| dicData      | 数据字典值                         | `{label: string, value: any}[]`                               | []     |
| dicUrl       | 数据字典接口 url 地址              | `string`                                                      | --     |
| dicQuery     | 数据字典接口请求参数               | `Record<string, any>`                                         | --     |
| dicHeaders   | 数据字典接口请求头参数             | `Record<string, any>`                                         | --     |
| dicFormatter | 数据字典接口返回数据格式化方法     | `(res: any) => { list: any[]; label: string; value: string }` | --     |
| multiple     | type=select 时是否多选             | `boolean`                                                     | false  |
| imgWidth     | type=picture 时图片宽度            | `string`                                                      | '70px' |
| imgHeight    | type=picture 时图片高度            | `string`                                                      | '70px' |
| imgPrefix    | type=picture 时图片 url 前缀       | `string`                                                      | --     |
| imgSuffix    | type=picture 时图片 url 字符串间隔 | `string`                                                      | ';'    |
| type         | 类型                               | `string`                                                      | --     |

#### Column Type

| 名称          | 说明               |
| :------------ | :----------------- |
| index         | 索引列             |
| single        | 单选               |
| selection     | 多选               |
| input         | 输入框             |
| number        | 数字输入框         |
| textarea      | 文本域输入框       |
| password      | 密码输入框         |
| year          | 年选择器           |
| month         | 月选择器           |
| date          | 日期选择器         |
| datetime      | 日期时间选择器     |
| week          | 周选择器           |
| datetimerange | 日期时间范围选择器 |
| daterange     | 日期范围选择器     |
| monthrange    | 月份范围选择器     |
| yearrange     | 年范围选择器       |
| time          | 时间选择器         |
| timerange     | 时间范围选择器     |
| select        | 下拉选择           |
| checkbox      | 多选框             |
| radio         | 单选框             |
| switch        | 切换框             |
| picture       | 图片展示           |
| qrcode        | 二维码展示         |
| barcode       | 一维码展示         |
