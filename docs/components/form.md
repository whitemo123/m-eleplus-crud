# 表单 Form

_表单组件_

## 基础用法

<FormBasic />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { IFormOption } from 'm-eleplus-crud'

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
```

:::

## 查看模式

<FormView />

::: details Show Code

```vue

```

:::

## Form API

### Form Attributes

| 属性名     | 说明               | 类型                                    | 默认值 |
| :--------- | :----------------- | :-------------------------------------- | :----- |
| size       | 组件尺寸           | `default` &#124; `small` &#124; `large` | --     |
| loading    | 加载状态           | `boolean`                               | false  |
| permission | 权限对象           | `object`                                | {}     |
| model      | 表单数据           | `object`                                | {}     |
| readonly   | 是否查看模式(只读) | `boolean`                               | false  |
| option     | 表单配置           | `IFormOption`                           | --     |

### Form 事件

| 名称 | 说明 | 类型 |
| :--- | :--- | :--- |

### Form 插槽

| 名称    | 说明          | 值              |
| :------ | :------------ | :-------------- |
| prop 值 | prop 属性的值 | `{row, $index}` |

### Form Exposes

| 名称      | 说明                       | 类型                     |
| :-------- | :------------------------- | :----------------------- |
| validForm | 校验表单内容               | `() => Promise<boolean>` |
| clear     | 清空表单内容和重置错误信息 | `() => void`             |

### 额外类型

#### IFormOption

| 属性名     | 说明     | 类型            | 默认值 |
| :--------- | :------- | :-------------- | :----- |
| labelWidth | 标签宽度 | `string`        | '80px' |
| column     | 配置项   | `IFormColumn[]` | []     |

#### IFormColumn

| 属性名           | 说明                                               | 类型                                                          | 默认值                         |
| :--------------- | :------------------------------------------------- | :------------------------------------------------------------ | :----------------------------- |
| label            | 标题                                               | `string`                                                      | --                             |
| prop             | 字段名                                             | `string`                                                      | --                             |
| dicData          | 数据字典值                                         | `{label: string, value: any}[]`                               | []                             |
| dicUrl           | 数据字典接口 url 地址                              | `string`                                                      | --                             |
| dicQuery         | 数据字典接口请求参数                               | `Record<string, any>`                                         | --                             |
| dicHeaders       | 数据字典接口请求头参数                             | `Record<string, any>`                                         | --                             |
| dicFormatter     | 数据字典接口返回数据格式化方法                     | `(res: any) => { list: any[]; label: string; value: string }` | --                             |
| multiple         | type=select 时是否多选                             | `boolean`                                                     | false                          |
| clearable        | type=select 或时间类型 时是否可清空                | `boolean`                                                     | false                          |
| filterable       | type=select 时是否可搜索                           | `boolean`                                                     | false                          |
| filterMethod     | type=select 时自定义搜索方法                       | `(keyword: string) => void`                                   | --                             |
| remote           | type=select 时是否可远程搜索                       | `boolean`                                                     | --                             |
| remote           | type=select 时是否可远程搜索                       | `boolean`                                                     | --                             |
| remoteMethod     | type=select 时远程搜索方法                         | `(keyword: string) => void`                                   | --                             |
| loading          | type=select 时且开启 remote 远程搜索时候的加载状态 | `boolean`                                                     | --                             |
| startPlaceholder | 时间范围选择器中开始时间的占位符                   | `string`                                                      | --                             |
| endPlaceholder   | 时间范围选择器中结束时间的占位符                   | `string`                                                      | --                             |
| format           | 时间类型选择器输入框显示时间的格式                 | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| valueFormat      | 时间类型选择器绑定值时间的格式                     | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| labelWidth       | 单个标签文字宽度                                   | `string`                                                      | --                             |
| order            | 排序字段                                           | `number`                                                      | --                             |
| rules            | 校验规则                                           | `FormItemRule[]`                                              | --                             |
| span             | 单个占据的栅栏宽度                                 | `number`                                                      | 6                              |
| maxlength        | 输入框最大输入长度                                 | `number`                                                      | --                             |
| value            | 单个属性的默认值                                   | `any`                                                         | --                             |
| placeholder      | 占位文本                                           | `string`                                                      | --                             |
| type             | 类型                                               | `string`                                                      | --                             |

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
