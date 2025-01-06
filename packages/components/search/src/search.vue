<template>
  <div
    v-if="searchOption.column && searchOption.column.length"
    class="m-search"
  >
    <el-form
      ref="formRef"
      :inline="true"
      :model="proxys"
      :size="size || globalConfig.size"
      :disabled="loading"
      :label-width="searchOption.labelWidth"
      @submit.prevent
    >
      <el-row :gutter="0">
        <template
          v-for="(column, columnIndex) in searchOption.column"
          :key="columnIndex"
        >
          <el-col
            v-if="
              !searchOption.col ||
              !searchCol ||
              columnIndex < (searchOption.colIndex || 3)
            "
            :span="column.span || 6"
          >
            <el-form-item
              style="width: 100%"
              :label="column.label + ':'"
              :prop="column.prop"
              :rules="column.rules"
            >
              <!--插槽-->
              <slot
                v-if="slots[column.prop || '']"
                :name="column.prop"
                v-bind="{ size: size || globalConfig.size, loading: loading }"
              />
              <!---->
              <!--输入框-->
              <template
                v-else-if="!column.type || INPUT_TYPES.includes(column.type)"
              >
                <el-input
                  v-model.trim="proxys[column.prop || '']"
                  style="width: 100%"
                  type="text"
                />
              </template>
              <!---->
              <!--单选/多选-->
              <template
                v-else-if="SELECT_TYPES.includes(column.type as string)"
              >
                <el-select
                  v-model="proxys[column.prop || '']"
                  style="width: 100%"
                  :multiple="column.multiple || column.type === 'checkbox'"
                  :clearable="column.clearable"
                >
                  <el-option
                    v-for="(dicItem, dicIndex) in column.dicData"
                    :key="dicIndex"
                    :label="dicItem.label"
                    :value="dicItem.value"
                  />
                </el-select>
              </template>
              <!---->
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, useSlots, watch } from 'vue'
import { cloneDeep, get, set } from 'lodash-unified'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { debugWarn } from '@m-eleplus-crud/utils'
import { searchEmits, searchProps } from './search'
import type { ISearchColumn, ISearchOption } from './search'

import type { FormInstance } from 'element-plus'

const COMPONENT_NAME = 'MSearch'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(searchProps)
const emit = defineEmits(searchEmits)

// 插槽信息
const slots = useSlots() as any
console.log(emit)

// 输入框类型
const INPUT_TYPES = ['input', 'textarea', 'number', 'password']

// 下拉选择类型
const SELECT_TYPES = ['select', 'checkbox', 'radio', 'switch']

const searchOption = ref<ISearchOption>({
  // 默认label宽度80px
  labelWidth: '80px',
  // 默认展示3个
  colIndex: 3,
  // 默认不折叠
  col: false,
  // 搜索列配置
  column: [],
})

// 表单ref
const formRef = ref<FormInstance>()

// 全局配置
const globalConfig = useGlobalConfig()

// 搜索选项折叠
const searchCol = ref(true)

// 代理model
const proxys: any = new Proxy(props.model as any, {
  get(target, property) {
    return get(target, property)
  },
  set(target, property, value) {
    set(target, property, value)
    return true
  },
})

/**
 * 处理需要远程获取字典的配置
 */
const getAllRemoteDics = () => {
  if (!globalConfig.value?.httpGet) {
    debugWarn('MSearch', 'global config httpGet is null')
    return
  }
  /**
   * 调用接口设置到dicData
   * @param column 列配置
   */
  const updateRemoteDic = (column: ISearchColumn) => {
    return new Promise((resolve) => {
      let isSuccess = false
      // @ts-ignore
      globalConfig.value
        .httpGet(column.dicUrl, column.dicQuery, column.dicHeaders)
        .then((e: any) => {
          // @ts-ignore
          const { list, label, value } = column.dicFormatter(e)
          if (list && Array.isArray(list)) {
            column['dicData'] = list.map((item) => {
              const lastLabel = label.replace(/\{(\w+)\}/g, (match, key) => {
                return item[key] || match
              })
              return {
                label: lastLabel,
                value: item[value],
              }
            })
            isSuccess = true
          }
        })
        .finally(() => {
          if (!isSuccess) {
            column['dicData'] = []
          }
          resolve(null)
        })
    })
  }
  for (let i = 0; i < (searchOption.value?.column || []).length; i++) {
    // @ts-ignore
    const column = searchOption.value.column[i]
    if (column.dicUrl) {
      if (!column.dicFormatter) {
        debugWarn('MSearch', 'dicUrl and dicFormatter must be used together')
        continue
      }
      updateRemoteDic(column)
    }
  }
}

/**
 * @description 监听搜索列的变化
 */
watch(
  () => props.option as ISearchOption,
  (newVal: ISearchOption) => {
    if (newVal) {
      searchOption.value = Object.assign({}, searchOption.value, newVal)
      if (newVal.column) {
        searchOption.value.column = cloneDeep(
          newVal.column.filter(
            (column) => !(props.permission[column.prop || ''] === false)
          )
        )
      }
      // 处理远程字典的配置
      getAllRemoteDics()
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
