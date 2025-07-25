<script lang="ts" setup>
import { ref } from 'vue'

const modelForm = ref<any>({})

const crudRef = ref<any>()

const tableData = ref<any>([
  {
    id: '124545785441457845',
    nickName: '刘大成',
    name: '刘大成',
    age: 18,
    remark: '撒啊撒娇很久很久不打说不定还是德国撒娇好的vgdhv爱得更多v韩国va韩国v爱韩庚v的萨汗国的v阿达好尬v的安徽的vga的'
  },
])

const total = ref(11)

const query = ref<any>({
  page: 1,
  limit: 10
})

const crudOption = ref<any>({
  height: 'auto',
  border: true,
  column: [
    {
      type: "index"
    },
    {
      label: "ID",
      prop: 'id',
      width: 180,
      align: 'left',
      searchValue: '123',
      viewSpan: 6,
      formRules: [
        {
          required: true,
          message: '请输入ID',
          trigger: 'blur'
        }
      ],
      addHide: true
    },
    {
      label: "很长的名字啊啊啊啊啊",
      prop: "longProp",
      searchLabelWidth: '200px',
      addDisabled: true
    },
    {
      label: "昵称",
      prop: 'nickName',
      width: 150,
      viewSpan: 6,
      eventChange: (value: any) => {
        console.log(value)
      },
      formRules: [
        {
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }
      ],
    },
    {
      label: "真名",
      prop: 'name',
      width: 150,
      viewSpan: 6,
    },
    {
      label: "年龄",
      prop: 'age',
      width: 150,
      viewSpan: 6,
    },
    {
      label: "备注",
      prop: 'remark',
      overHidden: true
    },
  ]
})
</script>


<template>
  <div>
    <MCrud :permission="{add: true}" ref="crudRef" v-model:search="query" v-model="modelForm" :total="total" :data="tableData" :option="crudOption">
      <!-- <template #topLeft="{size}">
        <el-button :size="size" type="default">导出</el-button>
      </template> -->
      <template #topRight>
        <span>合计：100.25</span>
      </template>
      <template #idSearch>
        <el-input v-model="query.id" />
      </template>
      <template #nickName="{row, $index}">
        {{ row.nickName }}-{{ $index }}
      </template>
      <template #id="{row, $index}">
        <el-link type="primary" @click="crudRef.rowView(row, $index)" :underline="false">{{ row.id }}</el-link>
      </template>
    </MCrud>
  </div>
</template>


<style lang="scss" scoped>

</style>
