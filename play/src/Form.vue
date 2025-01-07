<script lang="ts" setup>
import { ref } from 'vue';

const modelForm = ref<any>({})

const loading = ref(false)

const formOption = ref<any>({
  column: [
    {
      label: '姓名',
      prop: 'name',
      rules: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    },
    {
      label: '备注',
      prop: 'name',
      type: 'textarea',
      maxlength: 100,
      showWordLimit: true,
      rules: [
        { required: true, message: '请输入备注', trigger: 'blur' }
      ]
    },
    {
      label: "密码",
      prop: "password",
      type: 'password',
      showPassword: true,
    },
    {
      label: "年龄",
      prop: "age",
      type: 'number',
    },
    {
      label: "性别",
      prop: "sex",
      type: 'select',
      order: 1,
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
    },
    {
      label: "颜色",
      prop: "color",
      type: 'radio',
      dicData: [
        {
          label: '红色',
          value: 1
        },
        {
          label: '绿色',
          value: 2
        }
      ]
    },
    {
      label: "身份",
      prop: "role",
      type: 'checkbox',
      dicData: [
        {
          label: '管理员',
          value: 1
        },
        {
          label: '测试',
          value: 2
        }
      ]
    },
    {
      label: "状态",
      prop: "status",
      type: 'switch',
      dicData: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 2
        }
      ]
    },
    {
      label: "二维码",
      prop: "qrcode",
      type: "qrcode"
    },
    {
      label: "一维码",
      prop: "barcode",
      type: "barcode"
    },
    {
      label: "创建时间",
      prop: "createTime",
      type: 'datetimerange',
    },
    {
      label: "发放日期",
      prop: "sendTime",
      type: 'daterange',
    },
    {
      label: "图片",
      prop: "pic",
      type: 'picture',
    }
  ]
})
</script>

<template>
  <div>
    {{ modelForm }}
    <MForm :loading="loading" :model="modelForm" :option="formOption">
      <template #sex>
        <el-input></el-input>
      </template>
    </MForm>
  </div>
</template>
