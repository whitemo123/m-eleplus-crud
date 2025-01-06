<script lang="ts" setup>
import { ref } from 'vue';

const searchForm = ref<any>({})

const searchOption = ref<any>({
  column: [
    {
      label: '姓名',
      prop: 'name',
      rules: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    },
    {
      label: "性别",
      prop: "sex",
      type: 'select',
      dicData: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        },
      ]
    },
    {
      label: "兴趣",
      prop: "habbit",
      type: 'select',
      multiple: true,
      dicData: [
        {
          label: '篮球',
          value: '1'
        },
        {
          label: '足球',
          value: '2'
        },
        {
          label: '乒乓球',
          value: '3'
        },
      ]
    },
    {
      label: "班级",
      prop: "classId",
      type: 'select',
      dicUrl: '/class/list',
      dicQuery: {
        status: 1
      },
      dicHeaders: {
        testHeader: '1'
      },
      dicFormatter: (res: any) => ({list: res.data, label: '{label}-{value}', value: 'value'})
    }
  ]
})
</script>

<template>
  <div>
    {{ searchForm }}
    <MSearch :model="searchForm" :option="searchOption">
      <template #sex>
        <el-input></el-input>
      </template>
    </MSearch>
  </div>
</template>
