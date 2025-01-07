<script lang="ts" setup>
import { ref, useSlots, watch } from 'vue'
import { cloneDeep, get, set } from 'lodash-unified'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { debugWarn } from '@m-eleplus-crud/utils'
import { formEmits, formProps } from './form'
import type { IDictValue } from '@m-eleplus-crud/components/common'
import type { FormInstance } from 'element-plus'
import type { IFormColumn, IFormOption } from './form'

const COMPONENT_NAME = 'MForm'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(formProps)
const emit = defineEmits(formEmits)

// 插槽信息
const slots = useSlots() as any

// 全局配置
const globalConfig = useGlobalConfig()

// 表单实例
const formRef = ref<FormInstance>()

// 表单输入类型
const INPUT_TYPES = [
  'input',
  'textarea',
  'number',
  'password',
  'qrcode',
  'barcode',
]

// 日期类型
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

// 需要字典显示处理
const NEED_DIC_TYPE = ['select', 'checkbox', 'radio', 'switch']

// 表单配置
const formOption = ref<IFormOption>({
  // 默认标签宽度80px
  labelWidth: '80px',
  column: [],
})

// 表单model
const proxys = new Proxy(props.model, {
  get(target, property) {
    return get(target, property)
  },
  set(target, property, value) {
    set(target, property, value)
    return true
  },
})
console.log(props, emit)

/**
 * @description 初始化表单的值
 */
const initValue = () => {
  // 初始化搜索表单的值
  if (formOption.value && formOption.value.column) {
    for (let i = 0; i < formOption.value.column?.length; i++) {
      const column = formOption.value.column[i]
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
 * 处理需要远程获取字典的配置
 */
const getAllRemoteDics = () => {
  if (!globalConfig.value?.httpGet) {
    debugWarn('MForm', 'global config httpGet is null')
    return
  }
  /**
   * 调用接口设置到dicData
   * @param column 列配置
   */
  const updateRemoteDic = (column: IFormColumn) => {
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
  for (let i = 0; i < (formOption.value?.column || []).length; i++) {
    // @ts-ignore
    const column = formOption.value.column[i]
    if (column.dicUrl) {
      if (!column.dicFormatter) {
        debugWarn('MForm', 'dicUrl and dicFormatter must be used together')
        continue
      }
      updateRemoteDic(column)
    }
  }
}

/**
 * 解析字典并展示
 * @param row 行数据
 * @param column 列配置
 */
const formatDicValue = (row: any, column: IFormColumn) => {
  // 未拿到字典值的placeholder
  let dictLabel: string | undefined = ''
  // 查找
  const findLabelByValue = (dicData: IDictValue[], value: any) => {
    const dictItem = (dicData || []).find((dict) => dict.value === value)
    if (dictItem === undefined) {
      return dictLabel
    }
    return dictItem.label
  }
  if (
    (column.type === 'select' && column.multiple) ||
    column.type === 'checkbox'
  ) {
    // select下拉且开启多选/多选模式
    let values: any = []

    if (
      row[column.prop || ''] != null &&
      row[column.prop || ''] != undefined &&
      row[column.prop || ''] !== ''
    ) {
      if (Array.isArray(row[column.prop || ''])) {
        // 数据就是数组
        values = row[column.prop || '']
      } else if (typeof row[column.prop || ''] === 'string') {
        // 数据是字符串，启动字符分割，后续需要弄成从配置读取
        values = row[column.prop || ''].split(',')
      } else {
        // 最后情况变成数组
        values = [row[column.prop || '']]
      }
    }
    // 结果集合
    const result: string[] = []
    for (const value of values) {
      dictLabel = findLabelByValue(column.dicData || [], value)
      if (dictLabel === undefined) {
        break
      }
      result.push(dictLabel)
    }
    return result.join(',')
  }
  // 单模式
  dictLabel = findLabelByValue(column.dicData || [], row[column.prop || ''])
  return dictLabel
}

watch(
  () => props.option as IFormOption,
  (newVal: IFormOption) => {
    if (newVal) {
      formOption.value = Object.assign({}, formOption.value, newVal)
      if (newVal.column) {
        formOption.value.column = cloneDeep(
          newVal.column
            .filter(
              (column) => !(props.permission[column.prop || ''] === false)
            )
            .sort((a, b) => (b.order || 0) - (a.order || 0))
        )
        // 处理远程字典的配置
        getAllRemoteDics()
        if (!props.readonly) {
          // 初始化表单的值
          initValue()
        }
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <div class="m-form">
    <!--编辑模式-->
    <el-form
      v-if="!readonly"
      ref="formRef"
      :model="proxys"
      :disabled="loading"
      :size="size || globalConfig.size"
      :label-width="formOption.labelWidth"
      style="width: 100%"
      @submit.prevent
    >
      <el-row :gutter="0">
        <el-col
          v-for="(column, columnIndex) in formOption.column"
          :key="columnIndex"
          :span="column.span || 12"
        >
          <el-form-item
            style="width: 100%"
            :label="column.label + ':'"
            :prop="column.prop"
            :rules="column.rules"
          >
            <!--插槽信息-->
            <slot
              v-if="slots[column.prop || '']"
              :name="column.prop"
              v-bind="{ size: size || globalConfig.size, loading: loading }"
            />
            <!---->
            <!--输入框-->
            <el-input
              v-else-if="!column.type || INPUT_TYPES.includes(column.type)"
              v-model.trim="proxys[column.prop || '']"
              style="width: 100%"
              :placeholder="column.placeholder"
              :maxlength="column.maxlength"
              :show-word-limit="column.showWordLimit"
              :show-password="column.showPassword"
              :type="
                !column.type || column.type === 'input' ? 'text' : column.type
              "
            />
            <!---->
            <!--下拉框-->
            <el-select
              v-else-if="column.type === 'select'"
              v-model.trim="proxys[column.prop || '']"
              style="width: 100%"
              :placeholder="column.placeholder"
              :multiple="column.multiple"
              :clearable="column.clearable"
              :filterable="column.filterable"
              :filter-method="column.filterMethod"
              :remote="column.remote"
              :remote-method="column.remoteMethod"
              :loading="column.loading"
            >
              <el-option
                v-for="(dicItem, dicIndex) in column.dicData || []"
                :key="dicIndex"
                :label="dicItem.label"
                :value="dicItem.value"
              />
            </el-select>
            <!---->
            <!--radio-->
            <el-radio-group
              v-else-if="column.type === 'radio'"
              v-model="proxys[column.prop || '']"
              style="width: 100%"
            >
              <el-radio
                v-for="(dicItem, dicIndex) in column.dicData || []"
                :key="dicIndex"
                :value="dicItem.value"
                :label="dicItem.value"
              >
                {{ dicItem.label }}
              </el-radio>
            </el-radio-group>
            <!---->
            <!--checkbox-->
            <el-checkbox-group
              v-else-if="column.type === 'checkbox'"
              v-model="proxys[column.prop || '']"
              style="width: 100%"
            >
              <el-checkbox
                v-for="(dicItem, dicIndex) in column.dicData || []"
                :key="dicIndex"
                :label="dicItem.label"
                :value="dicItem.value"
              />
            </el-checkbox-group>
            <!---->
            <!--switch-->
            <template v-else-if="column.type === 'switch'">
              <span
                v-if="!column.dicData || column.dicData.length != 2"
                style="
                  color: var(--el-text-color-placeholder);
                  line-height: 32px;
                  height: 32px;
                "
                >"dicData/dicUrl的结果"未设置或长度不等于2</span
              >
              <template v-else>
                <el-switch
                  v-model="proxys[column.prop || '']"
                  :active-value="column.dicData[0].value"
                  :inactive-value="column.dicData[1].value"
                />
                <span
                  style="
                    font-size: var(--el-font-size-base);
                    color: var(--el-text-color-regular);
                    margin-left: 6px;
                  "
                  >{{
                    proxys[column.prop || ''] === column.dicData[0].value
                      ? column.dicData[0].label
                      : column.dicData[1].label
                  }}</span
                >
              </template>
            </template>
            <!---->
            <!--时间-->
            <template v-else-if="DATE_TYPES.includes(column.type)">
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
            <!---->
            <!--picture-->
            <span
              v-else-if="column.type === 'picture'"
              style="
                color: var(--el-text-color-regular);
                line-height: 32px;
                height: 32px;
              "
            >
              暂不支持picture，请使用插槽自行实现
            </span>
            <!---->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!---->
    <!--详情模式-->
    <el-descriptions
      v-else
      :size="size || globalConfig.size"
      :column="24"
      style="width: 100%"
      border
    >
      <el-descriptions-item
        v-for="(item, index) in formOption.column"
        :key="index"
        :label="item.label"
        :span="item.span || 12"
      >
        <template v-if="item.type === 'picture'">
          <!--图片插槽-->
        </template>
        <template v-else-if="NEED_DIC_TYPE.includes(item.type || '')">
          {{ formatDicValue(proxys, item) }}
        </template>
        <template v-else>
          {{ proxys[item.prop || ''] }}
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <!---->
  </div>
</template>
