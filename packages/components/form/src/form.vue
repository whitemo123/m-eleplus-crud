<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue'
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
defineEmits(formEmits)

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

/**
 * @description 计算详情模式下的表格行
 */
const detailTableRows = computed(() => {
  const rows = []
  let currentRow = []
  let currentTotal = 0
  for (const item of formOption.value.column || []) {
    const req = item.span || 12
    // 若当前行加入该项超过总列数，则开启新行
    if (currentTotal + req > 24) {
      rows.push(currentRow)
      currentRow = []
      currentTotal = 0
    }
    currentRow.push(item)
    currentTotal += req
  }
  if (currentRow.length) rows.push(currentRow)
  return rows
})

// 表单model
const proxys = new Proxy(props.model as any, {
  get(target, property) {
    return get(target, property)
  },
  set(target, property, value) {
    set(target, property, value)
    return true
  },
})

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
  const hasDicUrl = formOption.value?.column?.some((column) => column.dicUrl)
  if (hasDicUrl && !globalConfig.value?.httpGet) {
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
 * 根据配置获取表单项的绑定事件
 * @param column
 */
const getFormItemEventBind = (column: IFormColumn): object => {
  const result: any = {}
  for (const key in column) {
    if (key.startsWith('event')) {
      let funName = key.replace('event', '')
      funName = funName.charAt(0).toLowerCase() + funName.slice(1)
      // @ts-ignore
      result[funName] = column[key]
    }
  }
  return result
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

/**
 * 拿到详情模式下的图片集合
 * @param row
 * @param column
 */
const getDetailPic = (row: any, column: IFormColumn) => {
  if (!row || !row[column.prop || '']) {
    return []
  }
  const pics: string[] = row[column.prop || '']
    .split(column.imgSuffix || ';')
    .map((pic: string) => (column.imgPrefix || '') + pic)
  return pics
}

const getValueColspan = (
  item: IFormColumn,
  rows: IFormColumn[],
  index: number
) => {
  const getRemaining = (row: IFormColumn[]) => {
    const used = row.reduce((acc, item) => acc + (item.span || 12), 0)
    return 24 - used
  }
  if (index === rows.length - 1) {
    return (item.span || 12) + getRemaining(rows) - 1
  }
  return (item.span || 12) - 1
}

/**
 * @description 校验表单
 */
const validForm = (): Promise<boolean> => {
  return new Promise((resolve) => {
    formRef.value!.validate((valid) => {
      resolve(valid)
    })
  })
}

/**
 * @description 清空数据和校验规则
 */
const clear = () => {
  // 清空校验规则
  formRef.value?.clearValidate()
  // 清空表单数据
  formRef.value?.resetFields()
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

defineExpose({
  /**
   * @description 校验表单
   */
  validForm,
  /**
   * @description 清空表单
   */
  clear,
})
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
            :label-width="column.labelWidth || formOption.labelWidth"
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
              :disabled="column.disabled || false"
              :type="
                !column.type || column.type === 'input' ? 'text' : column.type
              "
              v-on="getFormItemEventBind(column)"
            />
            <!---->
            <!--下拉框-->
            <el-select
              v-else-if="column.type === 'select'"
              v-model.trim="proxys[column.prop || '']"
              style="width: 100%"
              :disabled="column.disabled || false"
              :placeholder="column.placeholder"
              :multiple="column.multiple"
              :clearable="column.clearable"
              :filterable="column.filterable"
              :filter-method="column.filterMethod"
              :remote="column.remote"
              :remote-method="column.remoteMethod"
              :loading="column.loading"
              v-on="getFormItemEventBind(column)"
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
              :disabled="column.disabled || false"
              style="width: 100%"
              v-on="getFormItemEventBind(column)"
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
              :disabled="column.disabled || false"
              v-on="getFormItemEventBind(column)"
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
                  :disabled="column.disabled || false"
                  :active-value="column.dicData[0].value"
                  :inactive-value="column.dicData[1].value"
                  v-on="getFormItemEventBind(column)"
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
                :disabled="column.disabled || false"
                :start-placeholder="column.startPlaceholder"
                :end-placeholder="column.endPlaceholder"
                :format="column.format"
                :value-format="
                  column.valueFormat || getValueFormatByType(column.type)
                "
                v-on="getFormItemEventBind(column)"
              />
              <el-time-picker
                v-else
                v-model="proxys[column.prop || '']"
                :disabled="column.disabled || false"
                :is-range="column.type === 'timerange'"
                :clearable="column.clearable"
                :start-placeholder="column.startPlaceholder"
                :end-placeholder="column.endPlaceholder"
                :value-format="
                  column.valueFormat || getValueFormatByType(column.type)
                "
                v-on="getFormItemEventBind(column)"
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
    <template v-else>
      <table class="detail-desc">
        <tbody>
          <tr v-for="(row, rowIndex) in detailTableRows" :key="rowIndex">
            <template v-for="(column, index) in row" :key="index">
              <td
                :style="{ width: column.labelWidth || formOption.labelWidth }"
                colspan="1"
                class="label"
              >
                {{ column.label }}
              </td>
              <td :colspan="getValueColspan(column, row, index)">
                <template v-if="column.type === 'picture'">
                  <MPicture
                    :src="getDetailPic(proxys, column)[0]"
                    :preview-src-list="getDetailPic(proxys, column)[0]"
                    img-width="100px"
                    img-height="100px"
                  />
                </template>
                <template v-else-if="NEED_DIC_TYPE.includes(column.type || '')">
                  {{ formatDicValue(proxys, column) }}
                </template>
                <template v-else-if="column.type === 'qrcode'">
                  <MQrcode
                    v-if="proxys[column.prop || '']"
                    :text="proxys[column.prop || '']"
                    align="center"
                  />
                </template>
                <template v-else-if="column.type === 'barcode'">
                  <MBarcode
                    v-if="proxys[column.prop || '']"
                    :text="proxys[column.prop || '']"
                    align="center"
                  />
                </template>
                <template v-else>
                  {{ proxys[column.prop || ''] }}
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
