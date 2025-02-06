# 增删改查 Crud

_增删改查组件，或许它真的能躲得过那碗胡辣汤_

## 基础用法

<CrudBasic />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ICrudOption } from 'm-eleplus-crud'

const crudOption = ref<ICrudOption>({
  border: true,
  column: [
    {
      label: '名字',
      prop: 'name',
      search: true,
      formRules: [
        {
          required: true,
          message: '请输入名字',
          trigger: 'blur',
        },
      ],
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

const tableData = ref<any>([])

const tableTotal = ref(0)

const tableLoading = ref(false)

const modelForm = ref<any>({})

const query = ref<any>({
  page: 1,
  limit: 10,
})

const rowSave = (form: any, done: () => void, loading: () => void) => {
  new Promise((resolve) => {
    ElMessage.success(
      `模拟异步请求，3s后关闭，表单内容：${JSON.stringify(form)}`
    )
    setTimeout(() => {
      resolve(null)
    }, 3000)
  })
    .then(() => {
      done()
    })
    .finally(() => {
      setTimeout(() => {
        loading()
      }, 500)
    })
}

const rowEdit = (form: any, done: () => void, loading: () => void) => {
  new Promise((resolve) => {
    ElMessage.success(
      `模拟异步请求，3s后关闭，表单内容：${JSON.stringify(form)}`
    )
    setTimeout(() => {
      resolve(null)
    }, 3000)
  })
    .then(() => {
      done()
    })
    .finally(() => {
      setTimeout(() => {
        loading()
      }, 500)
    })
}

const rowDel = (row: any, index: number) => {
  ElMessage.success(`删除内容：${JSON.stringify(row)}，索引：${index}`)
}

const getList = () => {
  ElMessage.success(
    `模拟异步请求，3s后拿到数据，查询条件：${JSON.stringify(query.value)}`
  )
  tableLoading.value = true
  setTimeout(() => {
    tableData.value = [
      ...tableData.value,
      ...[
        {
          name: `ZhangSan${Math.random()}`,
          sex: 1,
        },
        {
          name: `LiSi${Math.random()}`,
          sex: 2,
        },
      ],
    ]
    tableTotal.value += 2
    tableLoading.value = false
  }, 3000)
}
</script>

<template>
  <div style="width: 100%">
    <MCrud
      v-model="modelForm"
      v-model:search="query"
      :option="crudOption"
      :data="tableData"
      :total="tableTotal"
      :loading="tableLoading"
      @row-save="rowSave"
      @row-edit="rowEdit"
      @row-del="rowDel"
      @search="getList"
      @reset="getList"
    />
  </div>
</template>
```

:::

## 自定义一切

<CrudCustomBtns />

::: details Show Code

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CrudInstance, ICrudOption } from 'm-eleplus-crud'

const crudRef = ref<CrudInstance>()

const crudOption = ref<ICrudOption>({
  border: true,
  column: [
    {
      label: '名字',
      prop: 'name',
      search: true,
      formRules: [
        {
          required: true,
          message: '请输入名字',
          trigger: 'blur',
        },
      ],
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

const tableData = ref<any>([
  {
    name: `ZhangSan`,
    sex: 1,
  },
  {
    name: `LiSi`,
    sex: 2,
  },
])

const tableTotal = ref(2)

const tableLoading = ref(false)

const modelForm = ref<any>({})

const query = ref<any>({
  page: 1,
  limit: 10,
})

const rowSave = (form: any, done: () => void, loading: () => void) => {
  new Promise((resolve) => {
    ElMessage.success(
      `模拟异步请求，3s后关闭，表单内容：${JSON.stringify(form)}`
    )
    setTimeout(() => {
      resolve(null)
    }, 3000)
  })
    .then(() => {
      done()
    })
    .finally(() => {
      setTimeout(() => {
        loading()
      }, 500)
    })
}

const rowEdit = (form: any, done: () => void, loading: () => void) => {
  new Promise((resolve) => {
    ElMessage.success(
      `模拟异步请求，3s后关闭，表单内容：${JSON.stringify(form)}`
    )
    setTimeout(() => {
      resolve(null)
    }, 3000)
  })
    .then(() => {
      done()
    })
    .finally(() => {
      setTimeout(() => {
        loading()
      }, 500)
    })
}

const rowDel = (row: any, index: number) => {
  ElMessage.success(`删除内容：${JSON.stringify(row)}，索引：${index}`)
}

const openAdd = () => {
  crudRef.value?.rowAdd()
}

const openEdit = (row: any, index: number) => {
  // 这里也可以调用详情接口啥的，那下面传的就不是row而是接口获取的数据
  crudRef.value?.rowEdit(row, index)
}

const openDel = (row: any, index: number) => {
  crudRef.value?.rowDel(row, index)
}
</script>

<template>
  <div style="width: 100%">
    <MCrud
      ref="crudRef"
      v-model="modelForm"
      v-model:search="query"
      :option="crudOption"
      :data="tableData"
      :total="tableTotal"
      :loading="tableLoading"
      @row-save="rowSave"
      @row-edit="rowEdit"
      @row-del="rowDel"
    >
      <template #addBtn="{ size }">
        <el-button :size="size" type="primary" icon="Plus" @click="openAdd">
          自定义新增按钮
        </el-button>
      </template>
      <template #topLeft="{ size }">
        <el-button :size="size" type="default" icon="Download">
          导出1
        </el-button>
        <el-button :size="size" type="default" icon="Download">
          导出2
        </el-button>
      </template>
      <template #topRight="{ size }"> 合计：2 </template>
      <template #nameSearch="{ size, loading }">
        <span>谁规定这里不能放文本的</span>
      </template>
      <template #name="{ row, $index }">
        <span>{{ row.name }}-{{ $index }}</span>
      </template>
      <template #menu="{ row, $index }">
        <el-link style="margin-right: 6px" @click="openEdit(row, $index)"
          >自定义编辑</el-link
        >
        <el-link @click="openDel(row, $index)">自定义删除</el-link>
      </template>
      <template #allTop="{ size, loading }">
        <span>顶部自定义</span>
      </template>
      <template #allBottom="{ size, loading }">
        <span>底部自定义</span>
      </template>
      <template #nameForm="{ size, loading }">
        <el-button :size="size" :loading="loading">其实也可以是按钮</el-button>
      </template>
    </MCrud>
  </div>
</template>
```

:::

## Crud API

### Crud Attributes

| 属性名                     | 说明                   | 类型                                    | 默认值 |
| :------------------------- | :--------------------- | :-------------------------------------- | :----- |
| v-model:search             | 查询表单绑定数据       | `object`                                | {}     |
| v-model/v-model:modelValue | 表单绑定数据           | `object`                                | {}     |
| data                       | 表格数据               | `array`                                 | []     |
| size                       | 组件尺寸               | `default` &#124; `small` &#124; `large` | --     |
| loading                    | 加载状态               | `boolean`                               | false  |
| total                      | 列表数据总条数         | `number`                                | 0      |
| permission                 | 权限对象               | `object`                                | {}     |
| v-model:select             | 表格选择数据           | `array`                                 | []     |
| beforeEnter                | 表单提交前是否通过函数 | `Promise<boolean>`                      | --     |
| option                     | 配置                   | `ICrudOption`                           | --     |

### Crud 事件

| 名称      | 说明                                                                                                                | 类型                                                                  |
| :-------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| rowSave   | 新增模式点击保存按钮，表单校验通过后触发(form:表单数据,done:处理新增逻辑后结束函数,loading:关闭表单的 loading 状态) | `(form: any, done: () => void, loading: () => void) => void`          |
| rowEdit   | 编辑模式点击保存按钮，表单校验通过后触发(form:表单数据,done:处理编辑逻辑后结束函数,loading:关闭表单的 loading 状态) | `(form: any, done: () => void, loading: () => void) => void`          |
| rowCancel | 点击取消按钮触发(form:表单数据,index:当前列表数据的对应索引,type:弹窗模式)                                          | `(form: any, index: number, type: 'add' \| 'edit' \| 'view') => void` |
| rowDel    | 点击删除并确认后触发事件(row:当前操作数据,index:当前列表数据的对应索引)                                             | `(row: any, index: number) => void`                                   |
| search    | 查询触发事件                                                                                                        | `(form: any) => void`                                                 |
| reset     | 重置触发事件                                                                                                        | `() => void`                                                          |

### Crud 插槽

| 名称           | 说明                                                  | 值                |
| :------------- | :---------------------------------------------------- | :---------------- |
| prop 值        | 列表插槽                                              | `{row, $index}`   |
| addBtn         | 自定义新增按钮                                        | `{size}`          |
| editBtn        | 自定义编辑按钮                                        | `{row, $index}`   |
| delBtn         | 自定义删除按钮                                        | `{row, $index}`   |
| menu           | 自定义整个操作列                                      | `{row, $index}`   |
| topLeft        | 表格顶部左边区域(不包括新增按钮)                      | `{size}`          |
| topRight       | 表格顶部右边区域                                      | `{size}`          |
| prop 值+Search | 自定义查询区域某个字段，例如 prop=name，则 nameSearch | `{size, loading}` |
| allTop         | 表单顶部自定义(包括新增/编辑/查看)                    | `{size, loading}` |
| formTop        | 新增/编辑顶部自定义                                   | `{size, loading}` |
| addTop         | 新增顶部自定义                                        | `{size, loading}` |
| editTop        | 编辑顶部自定义                                        | `{size, loading}` |
| viewTop        | 查看顶部自定义                                        | `{size, loading}` |
| prop 值+Form   | 自定义表单某个字段，例如 prop=name，则 nameForm       | `{size, loading}` |
| allBottom      | 表单底部自定义(包括新增/编辑/查看)                    | `{size, loading}` |
| formBottom     | 新增/编辑顶部自定义                                   | `{size, loading}` |
| addBottom      | 新增顶部自定义                                        | `{size, loading}` |
| editBottom     | 编辑顶部自定义                                        | `{size, loading}` |
| viewBottom     | 查看顶部自定义                                        | `{size, loading}` |

### Crud Exposes

| 名称    | 说明                                        | 类型                             |
| :------ | :------------------------------------------ | :------------------------------- |
| rowAdd  | 打开新增弹窗                                | `() => void`                     |
| rowEdit | 打开编辑弹窗(row:表单数据,index:列表索引)   | `(row:any,index:number) => void` |
| rowView | 打开详情弹窗(row:表单数据,index:列表索引)   | `(row:any,index:number) => void` |
| rowDel  | 打开删除确认框(row:表单数据,index:列表索引) | `(row:any,index:number) => void` |

### 额外类型

#### ICrudOption

| 属性名           | 说明                                 | 类型                                        | 默认值   |
| :--------------- | :----------------------------------- | :------------------------------------------ | :------- |
| searchBtnText    | 搜索按钮文字                         | `string`                                    | 搜 索    |
| resetBtnText     | 清空按钮文字                         | `string`                                    | 清 空    |
| searchBtnIcon    | 搜索按钮图标                         | `string`                                    | Search   |
| resetBtnIcon     | 清空按钮文字                         | `string`                                    | Delete   |
| colIndex         | 收缩展示个数                         | `number`                                    | 3        |
| col              | 是否开启收缩                         | `boolean`                                   | false    |
| menu             | 是否显示操作列                       | `boolean`                                   | false    |
| stripe           | 是否显示斑马纹                       | `boolean`                                   | false    |
| border           | 是否显示纵向边框                     | `boolean`                                   | false    |
| menuWidth        | 操作栏宽度                           | `number`                                    | 220      |
| menuFixed        | 操作栏列冻结列 ，true 表示固定在左侧 | `true` &#124; `'left'` &#124; `'right'`     | 'right'  |
| menuAlign        | 操作栏按钮的对齐方式                 | `'left'` &#124; `'center'` &#124; `'right'` | 'center' |
| menuTitle        | 操作栏标题名称                       | `string`                                    | '操作'   |
| addBtn           | 新增按钮是否需要                     | `boolean`                                   | true     |
| editBtn          | 编辑按钮是否需要                     | `boolean`                                   | true     |
| delBtn           | 删除按钮是否需要                     | `boolean`                                   | true     |
| addBtnText       | 新增按钮图标                         | `string`                                    | '新 增'  |
| addBtnIcon       | 新增按钮图标                         | `string`                                    | 'Plus'   |
| searchLabelWidth | 搜索 label 宽度                      | `string`                                    | '80px'   |
| formLabelWidth   | 表单 label 宽度                      | `string`                                    | '80px'   |
| addDialogTitle   | 新增弹窗标题                         | `string`                                    | '新增'   |
| editDialogTitle  | 编辑弹窗标题                         | `string`                                    | '编辑'   |
| viewDialogTitle  | 查看弹窗标题                         | `string`                                    | '查看'   |
| dialogWidth      | 弹窗宽度                             | `string`                                    | '800px'  |
| height           | 表格高度                             | `string`                                    | --       |
| maxHeight        | 表格最大高度                         | `string`                                    | --       |
| calcHeight       | 表格高度调节(px)                     | `number`                                    | --       |
| column           | 配置项                               | `ICrudColumn[]`                             | []       |

#### ICrudColumn

| 属性名            | 说明                                               | 类型                                                          | 默认值                         |
| :---------------- | :------------------------------------------------- | :------------------------------------------------------------ | :----------------------------- |
| label             | 标题                                               | `string`                                                      | --                             |
| prop              | 字段名                                             | `string`                                                      | --                             |
| dicData           | 数据字典值                                         | `{label: string, value: any}[]`                               | []                             |
| dicUrl            | 数据字典接口 url 地址                              | `string`                                                      | --                             |
| dicQuery          | 数据字典接口请求参数                               | `Record<string, any>`                                         | --                             |
| dicHeaders        | 数据字典接口请求头参数                             | `Record<string, any>`                                         | --                             |
| dicFormatter      | 数据字典接口返回数据格式化方法                     | `(res: any) => { list: any[]; label: string; value: string }` | --                             |
| multiple          | type=select 时是否多选                             | `boolean`                                                     | false                          |
| clearable         | type=select 或时间类型 时是否可清空                | `boolean`                                                     | false                          |
| filterable        | type=select 时是否可搜索                           | `boolean`                                                     | false                          |
| filterMethod      | type=select 时自定义搜索方法                       | `(keyword: string) => void`                                   | --                             |
| remote            | type=select 时是否可远程搜索                       | `boolean`                                                     | --                             |
| remoteMethod      | type=select 时远程搜索方法                         | `(keyword: string) => void`                                   | --                             |
| loading           | type=select 时且开启 remote 远程搜索时候的加载状态 | `boolean`                                                     | --                             |
| imgWidth          | type=picture 时图片宽度                            | `string`                                                      | '70px'                         |
| imgHeight         | type=picture 时图片高度                            | `string`                                                      | '70px'                         |
| imgPrefix         | type=picture 时图片 url 前缀                       | `string`                                                      | --                             |
| imgSuffix         | type=picture 时图片 url 字符串间隔                 | `string`                                                      | ';'                            |
| startPlaceholder  | 时间范围选择器中开始时间的占位符                   | `string`                                                      | --                             |
| endPlaceholder    | 时间范围选择器中结束时间的占位符                   | `string`                                                      | --                             |
| format            | 时间类型选择器输入框显示时间的格式                 | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| valueFormat       | 时间类型选择器绑定值时间的格式                     | `string`                                                      | YYYY-MM-DD/YYYY-MM-DD HH:mm:ss |
| searchLabelWidth  | 单个搜索标签文字宽度                               | `string`                                                      | '80px'                         |
| formLabelWidth    | 单个表单标签文字宽度                               | `string`                                                      | '80px'                         |
| searchOrder       | 搜索排序字段                                       | `number`                                                      | --                             |
| formOrder         | 表单排序字段                                       | `number`                                                      | --                             |
| searchRules       | 单个搜索校验                                       | `FormItemRule[]`                                              | --                             |
| formRules         | 单个表单校验                                       | `FormItemRule[]`                                              | --                             |
| searchSpan        | 单个搜索占据的栅栏宽度                             | `number`                                                      | 6                              |
| formSpan          | 所有模式下单个表单占据的栅栏宽度                   | `number`                                                      | 6                              |
| addSpan           | 新增模式下单个表单占据的栅栏宽度                   | `number`                                                      | 6                              |
| viewSpan          | 查看模式下单个表单占据的栅栏宽度                   | `number`                                                      | 6                              |
| editSpan          | 编辑模式下单个表单占据的栅栏宽度                   | `number`                                                      | 6                              |
| maxlength         | 输入框最大输入长度                                 | `number`                                                      | --                             |
| searchValue       | 单个搜索属性的默认值                               | `any`                                                         | --                             |
| formValue         | 单个表单属性的默认值                               | `any`                                                         | --                             |
| searchPlaceholder | 搜索占位文本                                       | `string`                                                      | --                             |
| formPlaceholder   | 表单占位文本                                       | `string`                                                      | --                             |
| type              | 类型                                               | `string`                                                      | --                             |

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
