# 查询 Search

_列表查询区域组件_

## 基础用法

<SearchBasic />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ISearchOption } from 'm-eleplus-crud'

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
```

:::

## 局部展开收缩

_此处由于外容器宽度不够，展开/收缩按钮没在一行，实际是会一行展示_

<SearchCol />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ISearchOption } from 'm-eleplus-crud'

const searchOption = ref<ISearchOption>({
  col: true,
  colIndex: 1,
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
```

:::

## 搜索字段位置排序

<SearchOrder />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ISearchOption } from 'm-eleplus-crud'

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
```

:::

## 自定义搜索插槽

<SearchSlot />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { ISearchOption } from 'm-eleplus-crud'

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
    >
      <template #name="{ size, loading }">
        <span>我是插槽</span>
      </template>
    </MSearch>
  </div>
</template>
```

:::

## Search API

### Search Attributes

| 属性名     | 说明         | 类型                                    | 默认值 |
| :--------- | :----------- | :-------------------------------------- | :----- |
| size       | 组件尺寸     | `default` &#124; `small` &#124; `large` | --     |
| loading    | 加载状态     | `boolean`                               | false  |
| permission | 权限对象     | `object`                                | {}     |
| model      | 搜索数据对象 | `object`                                | {}     |
| option     | 配置         | `ISearchOption`                         | --     |

### Search 事件

| 名称   | 说明         | 类型                   |
| :----- | :----------- | :--------------------- |
| search | 点击搜索按钮 | `(model: any) => void` |
| reset  | 点击清空按钮 | --                     |

### Search 插槽

| 名称    | 说明          | 值                |
| :------ | :------------ | :---------------- |
| prop 值 | prop 属性的值 | `{size, loading}` |

### Search Exposes

| 名称   | 说明                               | 类型                     |
| :----- | :--------------------------------- | :----------------------- |
| search | 触发搜索逻辑，传入 page 搜索第几页 | `(page: number) => void` |
| reset  | 触发清空逻辑                       | `() => void`             |

### 额外类型

#### ISearchOption

| 属性名        | 说明             | 类型              | 默认值 |
| :------------ | :--------------- | :---------------- | :----- |
| searchBtnText | 搜索按钮文字     | `string`          | 搜 索  |
| resetBtnText  | 清空按钮文字     | `string`          | 清 空  |
| searchBtnIcon | 搜索按钮图标     | `string`          | Search |
| resetBtnIcon  | 清空按钮文字     | `string`          | Delete |
| labelWidth    | 搜索标签文字宽度 | `string`          | 80px   |
| colIndex      | 收缩展示个数     | `number`          | 3      |
| col           | 是否开启收缩     | `boolean`         | false  |
| column        | 配置项           | `ISearchColumn[]` | []     |

#### ISearchColumn

| 属性名           | 说明                                         | 类型                                                          | 默认值                         |
| :--------------- | :------------------------------------------- | :------------------------------------------------------------ | :----------------------------- |
| label            | 标题                                         | `string`                                                      | --                             |
| prop             | 字段名                                       | `string`                                                      | --                             |
| dicData          | 数据字典值                                   | `{label: string, value: any}[]`                               | []                             |
| dicUrl           | 数据字典接口 url 地址                        | `string`                                                      | --                             |
| dicQuery         | 数据字典接口请求参数                         | `Record<string, any>`                                         | --                             |
| dicHeaders       | 数据字典接口请求头参数                       | `Record<string, any>`                                         | --                             |
| dicFormatter     | 数据字典接口返回数据格式化方法               | `(res: any) => { list: any[]; label: string; value: string }` | --                             |
| multiple         | type=select 时是否多选                       | `boolean`                                                     | false                          |
| clearable        | type=select 或时间类型 时是否可清空          | `boolean`                                                     | false                          |
| startPlaceholder | 时间范围选择器中开始时间的占位符             | `string`                                                      | --                             |
| endPlaceholder   | 时间范围选择器中结束时间的占位符             | `string`                                                      | --                             |
| format           | 时间类型选择器输入框显示时间的格式           | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| valueFormat      | 时间类型选择器绑定值时间的格式               | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| labelWidth       | 标签文字宽度                                 | `string`                                                      | --                             |
| order            | 排序字段                                     | `number`                                                      | --                             |
| rules            | 校验规则                                     | `FormItemRule[]`                                              | --                             |
| span             | 单个占据的栅栏宽度                           | `number`                                                      | 6                              |
| value            | 单个属性的默认值                             | `any`                                                         | --                             |
| placeholder      | 占位文本                                     | `string`                                                      | --                             |
| type             | 类型（某些类型在查询组件中会被渲染成 input） | `string`                                                      | --                             |

#### Column Type

| 名称          | 说明               |
| :------------ | :----------------- |
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
