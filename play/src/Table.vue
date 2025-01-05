<script lang="ts" setup>
import { ref } from 'vue'

const tableData = ref<any>([
  {
    id: "1",
    pic: "http://gips3.baidu.com/it/u=1022347589,1106887837&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280;http://gips2.baidu.com/it/u=828570294,3060139577&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024",
    qrcode: "122134",
    barcode: '6944649700065',
    sex: 1,
    habbit: null,
    classId: 1
  },
  {
    id: "2",
    pic: "http://gips3.baidu.com/it/u=1022347589,1106887837&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280;http://gips2.baidu.com/it/u=828570294,3060139577&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024",
    qrcode: "sa76sa87sa",
    barcode: '2122333223233',
    sex: 2,
    habbit: '1,2',
    classId: null,
  },
  {
    id: "3",
    pic: "http://gips3.baidu.com/it/u=1022347589,1106887837&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280;http://gips2.baidu.com/it/u=828570294,3060139577&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024",
    qrcode: "23121ee22",
    barcode: '65321333232332',
    sex: null,
    habbit: ['1'],
    classId: 2
  }
])

const tableOption = ref<any>({
  menu: true,
  column: [
    // {
    //   label: "",
    //   type: 'selection',
    //   width: 100
    // },
    {
      label: "",
      type: 'single',
      width: 100
    },
    {
      label: "序号",
      type: 'index',
      width: 100
    },
    {
      label: "ID",
      prop: "id",
      hide: false,
      overHidden: true,
      help: '测试帮助信息',
      formatter: (row: any, column: any, index: number) => {
        return '测试'
      }
    },
    {
      label: "图片",
      prop: "pic",
      align: "center",
      type: "picture"
    },
    {
      label: "二维码",
      prop: "qrcode",
      align: "center",
      type: "qrcode"
    },
    {
      label: "一维码",
      prop: "barcode",
      align: "center",
      type: "barcode"
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
      dicFormatter: (res: any) => ({list: res.data, label: 'label', value: 'value'})
    }
  ]
})

const selectData = ref<any>([])
</script>

<template>
  <div>
    {{ selectData }}
    <MTable :data="tableData" :option="tableOption" v-model:select="selectData">
      <template #menu="scope">
        <!-- <button>{{ scope.row.id }}</button> -->
        <el-input v-model="scope.row.id"></el-input>
      </template>
    </MTable>
  </div>
</template>
