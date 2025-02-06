<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ICrudOption } from 'm-eleplus-crud/index.ts'

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
