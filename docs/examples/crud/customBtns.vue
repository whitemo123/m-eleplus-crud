<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CrudInstance, ICrudOption } from 'm-eleplus-crud/index.ts'

const crudRef = ref<CrudInstance>()

const crudOption = ref<ICrudOption>({
  border: true,
  column: [
    {
      label: 'ID',
      prop: 'id',
      align: 'left',
    },
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
    id: 1111111111,
    name: `ZhangSan`,
    sex: 1,
  },
  {
    id: 2222222222,
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
      <template #id="{ row, $index }">
        <el-link @click="crudRef?.rowView(row, $index)">{{ row.id }}</el-link>
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
