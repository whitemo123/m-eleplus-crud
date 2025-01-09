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

import type { ITableColumn, ITableOption } from './table'

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

// 表格配置
const tableOption = ref<ITableOption>({
  // 默认显示操作栏
  menu: false,
  // 默认不显示斑马纹
  stripe: false,
  // 默认不显示边框
  border: false,
  // 操作栏宽度
  menuWidth: 220,
  // 操作栏固定右侧
  menuFixed: 'right',
  // 操作栏按钮居中
  menuAlign: 'center',
  // 表格列配置
  column: [],
})

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
  const remotePromise: Promise<any>[] = []
  for (let i = 0; i < (tableOption.value.column || []).length; i++) {
    // @ts-ignore
    const column = tableOption.value.column[i]
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
  () => props.option as ITableOption,
  (newVal: ITableOption) => {
    if (newVal) {
      tableOption.value = Object.assign({}, tableOption.value, newVal)
      if (newVal.column) {
        tableOption.value.column = cloneDeep(
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
      :height="props.height"
      :max-height="props.maxHeight"
      @selection-change="selectionChange"
    >
      <template #empty>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 16px 0;
            box-sizing: border-box;
          "
        >
          <img
            src="data:image/png;base64,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"
          />
          <span style="line-height: normal">暂无数据</span>
        </div>
      </template>
      <el-table-column
        v-for="(column, columnIndex) in tableOption.column"
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
        <template v-if="slots[column.prop || '']" #default="scope">
          <slot :name="column.prop" v-bind="scope" />
        </template>
        <template
          v-else-if="NEED_SLOT_TYPE.includes(column.type || 'input')"
          #default="scope"
        >
          <!--图片-->
          <MPicture
            v-if="column.type === 'picture' && scope.row[column.prop || '']"
            :src="getProductPic(scope.row[column.prop || ''], column)[0]"
            :preview-src-list="
              getProductPic(scope.row[column.prop || ''], column)
            "
          />
          <!---->
          <!--二维码-->
          <MQrcode
            v-else-if="column.type === 'qrcode' && scope.row[column.prop || '']"
            :text="scope.row[column.prop || '']"
            :qrcode-width="column.qrcodeWidth"
            :qrcode-height="column.qrcodeHeight"
            align="center"
            @click="openPreviewCode(scope.row[column.prop || ''], 2)"
          />
          <!---->
          <!--一维码-->
          <MBarcode
            v-else-if="
              column.type === 'barcode' && scope.row[column.prop || '']
            "
            :text="scope.row[column.prop || '']"
            :barcode-width="column.barcodeWith"
            :barcode-height="column.barcodeHeight"
            @click="openPreviewCode(scope.row[column.prop || ''], 1)"
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
        v-if="tableOption.menu"
        :label="tableOption.menuTitle || t('m.table.menuTitle')"
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
