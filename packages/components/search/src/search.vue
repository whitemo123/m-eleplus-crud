<script lang="ts" setup>
import { ref, useSlots, watch } from 'vue'
import { cloneDeep, get, set } from 'lodash-unified'
import { useLocale } from '@m-eleplus-crud/hooks'
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

// 国际化
const { t } = useLocale()

// 输入框类型
const INPUT_TYPES = ['input', 'textarea', 'number', 'password']

// 下拉选择类型
const SELECT_TYPES = ['select', 'checkbox', 'radio', 'switch']

// 时间选择类型
const DATE_TYPES = [
  'year',
  'month',
  'date',
  'datetime',
  'week',
  'datetimerange',
  'daterange',
  'monthrange',
  'yearrange',
  'time',
  'timerange',
]

const searchOption = ref<ISearchOption>({
  searchBtnText: t('m.search.searchBtnText'),
  resetBtnText: t('m.search.resetBtnText'),
  // 搜索按钮默认Search图标
  searchBtnIcon: 'Search',
  // 重置按钮默认Delete图标
  resetBtnIcon: 'Delete',
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
 * 初始化搜索表单的值
 */
const initValue = () => {
  // 初始化搜索表单的值
  if (searchOption.value && searchOption.value.column) {
    for (let i = 0; i < searchOption.value.column?.length; i++) {
      const column = searchOption.value.column[i]
      if (column.prop && proxys[column.prop] === undefined) {
        if (column.value) {
          proxys[column.prop] = column.value
        } else {
          const ARR_TYPES = [
            'checkbox',
            'datetimerange',
            'daterange',
            'monthrange',
            'yearrange',
            'timerange',
          ]
          if (
            (column.type === 'select' && column.multiple) ||
            ARR_TYPES.includes(column.type || '')
          ) {
            proxys[column.prop] = []
          } else {
            proxys[column.prop] = ''
          }
        }
      }
    }
  }
}

/**
 * 根据类型获取默认时间格式
 * @param type 类型
 */
const getValueFormatByType = (type: string) => {
  let format = ''
  switch (type) {
    case 'yearrange':
    case 'year':
      format = 'YYYY'
      break
    case 'monthrange':
    case 'month':
      format = 'YYYY-MM'
      break
    case 'daterange':
    case 'week':
    case 'date':
      format = 'YYYY-MM-DD'
      break
    case 'datetimerange':
    case 'datetime':
      format = 'YYYY-MM-DD HH:mm:ss'
      break
    case 'time':
      format = 'HH:mm:ss'
      break
  }
  return format
}

/**
 * 查询搜索触发
 * @param page 第一页
 */
const search = (page = 1) => {
  if (searchOption.value.column && searchOption.value.column.length) {
    formRef.value?.validate((valid) => {
      if (valid) {
        // 搜索从第一页开始搜索，也支持传入页码
        if (proxys.page) {
          proxys.page = page
        }
        // emit搜索事件 如果非第一页，自动重置第一页
        emit('search', proxys)
      }
    })
  } else {
    // 搜索从第一页开始搜索，也支持传入页码
    if (proxys.page) {
      proxys.page = page
    }
    // emit搜索事件 如果非第一页，自动重置第一页
    emit('search', proxys)
  }
}

/**
 * 重置搜索
 */
const reset = () => {
  // 重置分页参数
  if (proxys.page) {
    proxys.page = 1
  }
  if (proxys.limit) {
    proxys.limit = 10
  }
  // 清空搜索表单的字段
  formRef.value?.resetFields()
  // emit重置事件
  emit('reset')
}

/**
 * 展开/折叠搜索
 */
const toggleCol = () => {
  searchCol.value = !searchCol.value
}

/**
 * 处理需要远程获取字典的配置
 */
const getAllRemoteDics = () => {
  const hasDicUrl = searchOption.value?.column?.some((column) => column.dicUrl)
  if (hasDicUrl && !globalConfig.value?.httpGet) {
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
          newVal.column
            .filter(
              (column) => !(props.permission[column.prop || ''] === false)
            )
            .sort((a, b) => (b.order || 0) - (a.order || 0))
        )
      }
      // 处理远程字典的配置
      getAllRemoteDics()
      // 初始化搜索表单的值
      initValue()
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

defineExpose({
  /**
   * @description 搜索方法
   */
  search,
  /**
   * @description 重置方法
   */
  reset,
})
</script>

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
              :label-width="column.labelWidth || searchOption.labelWidth"
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
                  :placeholder="column.placeholder"
                  style="width: 100%"
                  type="text"
                  @keyup.enter="search(1)"
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
                  :placeholder="column.placeholder"
                  :multiple="column.multiple || column.type === 'checkbox'"
                  :clearable="column.clearable"
                >
                  <el-option
                    v-for="(dicItem, dicIndex) in column.dicData || []"
                    :key="dicIndex"
                    :label="dicItem.label"
                    :value="dicItem.value"
                  />
                </el-select>
              </template>
              <!---->
              <!--时间选择-->
              <template v-else-if="DATE_TYPES.includes(column.type as string)">
                <el-date-picker
                  v-if="column.type !== 'time' && column.type !== 'timerange'"
                  v-model="proxys[column.prop || '']"
                  :type="column.type"
                  :clearable="column.clearable"
                  :start-placeholder="column.startPlaceholder"
                  :end-placeholder="column.endPlaceholder"
                  :format="column.format"
                  :value-format="
                    column.valueFormat || getValueFormatByType(column.type)
                  "
                />
                <el-time-picker
                  v-else
                  v-model="proxys[column.prop || '']"
                  :is-range="column.type === 'timerange'"
                  :clearable="column.clearable"
                  :start-placeholder="column.startPlaceholder"
                  :end-placeholder="column.endPlaceholder"
                  :value-format="
                    column.valueFormat || getValueFormatByType(column.type)
                  "
                />
              </template>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="6">
          <el-form-item class="m-search-btns" style="width: 100%">
            <el-button
              type="primary"
              :icon="searchOption.searchBtnIcon"
              :loading="loading"
              @click="search(1)"
            >
              {{ searchOption.searchBtnText }}
            </el-button>
            <el-button
              type="default"
              :icon="searchOption.resetBtnIcon"
              :loading="loading"
              @click="reset"
            >
              {{ searchOption.resetBtnText }}
            </el-button>
            <el-link
              v-if="searchOption.col"
              style="width: 54px; margin-left: 12px"
              underline="never"
              :disabled="loading"
              type="default"
              @click="toggleCol"
            >
              <el-icon style="margin-right: 6px">
                <ArrowDown v-if="searchCol" />
                <ArrowUp v-else />
              </el-icon>
              {{ searchCol ? t('m.search.expandBtn') : t('m.search.colBtn') }}
            </el-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
