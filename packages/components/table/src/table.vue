<script lang="ts" setup>
import { ref, useSlots, watch } from 'vue'

// @ts-ignore
import Qrcode from 'qrcodejs2-fix'
import JsBarcode from 'jsbarcode'

import { cloneDeep } from 'lodash-unified'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { debugWarn } from '@m-eleplus-crud/utils'
import { useLocale } from '@m-eleplus-crud/hooks'
import { tableEmits, tableProps } from './table'
import type { IDictValue } from '@m-eleplus-crud/components/common'

import type { ITableColumn } from './table'

const COMPONENT_NAME = 'MTable'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)

// 插槽信息
const slots = useSlots() as any

// 全局配置
const globalConfig = useGlobalConfig()

const { t } = useLocale()

// 需要字典显示处理
const NEED_DIC_TYPE = ['select', 'checkbox', 'radio', 'switch']

// 需要额外处理展示的类型
const NEED_SLOT_TYPE = [
  'picture',
  'qrcode',
  'barcode',
  'single',
  ...NEED_DIC_TYPE,
]

// 当前配置列
const tableColumns = ref<ITableColumn[]>([])

// 一维码/二维码 预览弹窗
const codePreviewDialog = ref(false)
// 一维码/二维码
const codePreview = ref('')

// 表格ref
const tableRef = ref<any>()

// 单选选择的数据
const selectIndex = ref<number>(-1)

// 表格key，用于刷新表格使用
const tableKey = ref(0)

// 业务表格加载状态
const tableLoading = ref(false)

/**
 * 解析图片
 * @param pic 图片url
 */
const getProductPic = (pic: string, column: ITableColumn) => {
  if (!pic) {
    return []
  }
  const picArr = pic
    .split(column.imgSuffix || ';')
    .map((p) => (column.imgPrefix || '') + p)

  return picArr
}

/**
 * 预览一维码/二维码
 * @param text 内容
 * @param type 类型 1 一维码 2 二维码
 */
const openPreviewCode = (text: string, type = 1) => {
  codePreviewDialog.value = true
  codePreview.value = text

  setTimeout(() => {
    if (type == 1) {
      // 一维码
      JsBarcode('#barcode-preview', text, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 50,
        displayValue: false,
      })
    } else if (type == 2) {
      // 二维码
      const dom = document.querySelector('#qrcode-preview')
      dom!.innerHTML = ''
      new Qrcode(dom, {
        text,
        width: 180,
        height: 180,
      })
    }
  }, 0)
}

/**
 * 表格选择事件
 * @param arrs 选择数据
 */
const selectionChange = (arrs: any[]) => {
  emit('update:select', cloneDeep(arrs))
  emit('selectionChange', arrs)
}

/**
 * 单选选择
 * @param index 索引
 */
const radioSelect = (index: number) => {
  if (index == selectIndex.value) {
    selectIndex.value = -1
  } else {
    selectIndex.value = index
  }
  if (selectIndex.value == -1) {
    emit('update:select', [])
    emit('selectionChange', [])
  } else {
    emit('update:select', [cloneDeep(props.data[selectIndex.value])])
    emit('selectionChange', [cloneDeep(props.data[selectIndex.value])])
  }
}

/**
 * 清空选择
 */
const clearSelection = () => {
  tableRef.value.clearSelection()
  selectIndex.value = -1
}

/**
 * 切换选择数据
 * @param index 行索引
 * @param selected 选择状态
 * @param type 类型 1 单选 2 多选
 */
const toggleRowSelection = (index: number, selected: boolean, type = 2) => {
  if (type == 2) {
    const row = props.data[index]
    tableRef.value.toggleRowSelection(row, selected)
  } else {
    radioSelect(index)
  }
}

/**
 * 刷新表格
 */
const refreshTable = () => {
  if (tableKey.value >= 9999) {
    tableKey.value = 0
  } else {
    tableKey.value++
  }
}

/**
 * 处理需要远程获取字典的配置
 */
const getAllRemoteDics = () => {
  if (!globalConfig.value?.httpGet) {
    debugWarn('MTable', 'global config httpGet is null')
    return
  }
  /**
   * 调用接口设置到dicData
   * @param column 列配置
   */
  const updateRemoteDic = (column: ITableColumn) => {
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
              return {
                label: item[label],
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
  const remotePromise: Promise<any>[] = []
  for (let i = 0; i < tableColumns.value.length; i++) {
    const column = tableColumns.value[i]
    if (column.dicUrl) {
      if (!column.dicFormatter) {
        debugWarn('MTable', 'dicUrl and dicFormatter must be used together')
        continue
      }
      remotePromise.push(updateRemoteDic(column))
    }
  }
  if (remotePromise.length) {
    tableLoading.value = true
    Promise.all(remotePromise).then(() => {
      // 刷新表格
      refreshTable()
      tableLoading.value = false
    })
  }
}

/**
 * 解析字典并展示
 * @param row 行数据
 * @param column 列配置
 */
const formatDicValue = (row: any, column: ITableColumn) => {
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
      row[column.prop as string] != null &&
      row[column.prop as string] != undefined &&
      row[column.prop as string] !== ''
    ) {
      if (Array.isArray(row[column.prop as string])) {
        // 数据就是数组
        values = row[column.prop as string]
      } else if (typeof row[column.prop as string] === 'string') {
        // 数据是字符串，启动字符分割，后续需要弄成从配置读取
        values = row[column.prop as string].split(',')
      } else {
        // 最后情况变成数组
        values = [row[column.prop as string]]
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
  dictLabel = findLabelByValue(column.dicData || [], row[column.prop as string])
  return dictLabel
}

watch(
  () => props?.option?.column as any,
  (newVal: ITableColumn[]) => {
    if (newVal && newVal.length) {
      tableColumns.value = cloneDeep(newVal.filter((column) => !column.hide))
      // 处理远程字典的配置
      getAllRemoteDics()
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

defineExpose({
  /**
   * @description 清空选择
   */
  clearSelection,
  /**
   * @description 切换某行数据选择
   */
  toggleRowSelection,
  /**
   * @description 刷新表格(注意不是用于搜索等刷新表格数据的)
   */
  refreshTable,
})
</script>

<template>
  <div class="m-table">
    <el-table
      ref="tableRef"
      :key="tableKey"
      v-loading="loading || tableLoading"
      style="width: 100%"
      :size="size || globalConfig.size"
      :data="data"
      @selection-change="selectionChange"
    >
      <el-table-column
        v-for="(column, columnIndex) in tableColumns"
        :key="columnIndex"
        :type="['index', 'selection'].includes(column.type as string) ? column.type : null"
        :width="column.width"
        :label="column.label"
        :prop="column.prop"
        :align="column.align || 'center'"
        :show-overflow-tooltip="column.overHidden"
        :formatter="column.formatter ? ((row: any, col: any, cellValue: any, index: number) => (column as any).formatter(row, column, index)) : null"
      >
        <!--帮助信息-->
        <template v-if="column.help" #header>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="column.help"
            placement="top"
          >
            <div class="help-table-header">
              <span style="margin-right: 4px">{{ column.label }}</span>
              <QuestionFilled style="width: 16px; height: 16px" />
            </div>
          </el-tooltip>
        </template>
        <!---->
        <template v-if="slots[column.prop as string]" #default="scope">
          <slot :name="column.prop" v-bind="scope" />
        </template>
        <template
          v-else-if="NEED_SLOT_TYPE.includes(column.type || 'input')"
          #default="scope"
        >
          <!--图片-->
          <MPicture
            v-if="column.type === 'picture' && scope.row[column.prop as string]"
            :src="getProductPic(scope.row[column.prop as string], column)[0]"
            :preview-src-list="getProductPic(scope.row[column.prop as string], column)"
          />
          <!---->
          <!--二维码-->
          <MQrcode
            v-else-if="column.type === 'qrcode' && scope.row[column.prop as string]"
            :text="scope.row[column.prop as string]"
            :qrcode-width="column.qrcodeWidth"
            :qrcode-height="column.qrcodeHeight"
            align="center"
            @click="openPreviewCode(scope.row[column.prop as string], 2)"
          />
          <!---->
          <!--一维码-->
          <MBarcode
            v-else-if="column.type === 'barcode' && scope.row[column.prop as string]"
            :text="scope.row[column.prop as string]"
            :barcode-width="column.barcodeWith"
            :barcode-height="column.barcodeHeight"
            @click="openPreviewCode(scope.row[column.prop as string], 1)"
          />
          <!---->
          <!--单选-->
          <el-radio
            v-else-if="column.type === 'single'"
            :model-value="scope.$index === selectIndex"
            :value="true"
            @click.prevent="radioSelect(scope.$index)"
          />
          <!--字典显示-->
          <div v-else-if="NEED_DIC_TYPE.includes(column.type || 'input')">
            {{ formatDicValue(scope.row, column) }}
          </div>
        </template>
      </el-table-column>
      <!--操作栏-->
      <el-table-column
        v-if="option.menu"
        :label="option.menuTitle || t('m.table.menuTitle')"
        align="center"
      >
        <template #default="scope">
          <slot v-if="slots.menu" name="menu" v-bind="scope" />
        </template>
      </el-table-column>
      <!---->
    </el-table>
    <!--二维码/一维码弹窗-->
    <MDialog
      v-model="codePreviewDialog"
      :title="t('m.table.preview')"
      :size="size"
      width="300px"
      :save-btn="false"
      :cancel-btn="false"
    >
      <div id="qrcode-preview" />
      <img id="barcode-preview" />
      <div class="qrcode-preview-code">{{ codePreview }}</div>
    </MDialog>
    <!---->
  </div>
</template>
