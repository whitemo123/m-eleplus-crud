<script lang="ts" setup>
import { ref } from 'vue'

const modelForm = ref<any>({})

const tableData = ref<any>([
  // {
  //   id: '124545785441457845',
  //   nickName: '刘大成'
  // }
])

const total = ref(1)

const query = ref<any>({
  page: 1,
  limit: 10
})

const crudOption = ref<any>({
  height: 'auto',
  column: [
    {
      label: "ID",
      prop: 'id',
      width: 180,
      align: 'left',
      search: true,
      searchValue: '123',
      searchRules: [
        {
          required: true,
          message: '请输入ID',
          trigger: 'blur'
        }
      ],
      addHide: true
    },
    {
      label: "昵称",
      prop: 'nickName',
    }
  ]
})
</script>


<template>
  <div>
    <MCrud v-model:search="query" v-model="modelForm" :total="total" :data="tableData" :option="crudOption">
      <template #topLeft="{size}">
        <el-button :size="size" type="default">导出</el-button>
      </template>
      <template #topRight>
        <span>合计：100.25</span>
      </template>
      <template #idSearch>
        <el-input v-model="query.id" />
      </template>
      <template #nickName="{row, $index}">
        {{ row.nickName }}-{{ $index }}
      </template>
    </MCrud>
  </div>
</template>


<style lang="scss" scoped>

</style>
