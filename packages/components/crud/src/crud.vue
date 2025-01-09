<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue'
import { cloneDeep, get, set } from 'lodash-unified'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { useLocale } from '@m-eleplus-crud/hooks'
import { crudEmits, crudProps } from './crud'
import type { ITableColumn, ITableOption } from '../../table'
import type { ICrudColumn, ICrudOption } from './crud'
import type { ISearchColumn, ISearchOption } from '../../search'
import type { IFormColumn, IFormOption } from '../../form'

const COMPONENT_NAME = 'MCrud'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(crudProps)
const emit = defineEmits(crudEmits)

// 插槽信息
const slots = useSlots() as any

// 全局配置
const globalConfig = useGlobalConfig()

// 国际化配置
const { t } = useLocale()

// 搜索插槽
const searchSlots = computed(() => {
  const keys = Object.keys(slots)
  const result: any = {}
  for (const key of keys) {
    if (key.endsWith('Search')) {
      result[key.replace('Search', '')] = slots[key]
    }
  }
  return result
})

// 表单插槽
const formSlots = computed(() => {
  const keys = Object.keys(slots)
  const result: any = {}
  for (const key of keys) {
    if (key.endsWith('Form')) {
      result[key.replace('Form', '')] = slots[key]
    }
  }
  return result
})

// 列表插槽
const tableSlots = computed(() => {
  const whites = ['topLeft', 'topRight', 'addBtn']
  const keys = Object.keys(slots)
  const result: any = {}
  for (const key of keys) {
    if (
      !whites.includes(key) &&
      !key.endsWith('Search') &&
      !key.endsWith('Form')
    ) {
      result[key] = slots[key]
    }
  }
  return result
})

/**
 * @description crud配置项
 */
const crudOption = ref<ICrudOption>({
  // 默认显示添加按钮
  addBtn: true,
  // 添加按钮文字
  addBtnText: t('m.crud.addBtnText'),
  // 添加按钮图标
  addBtnIcon: 'Plus',
  // 添加对话框标题
  addDialogTitle: t('m.crud.addDialogTitle'),
  // 编辑对话框标题
  editDialogTitle: t('m.crud.editDialogTitle'),
  // 查看对话框标题
  viewDialogTitle: t('m.crud.viewDialogTitle'),
  // 对话框宽度
  dialogWidth: '800px',

  column: [],
})

/**
 * @description 对话框类型
 */
const dialogType = ref<'add' | 'edit' | 'view'>('add')

/**
 * @description 对话框显示状态
 */
const dialogVisible = ref(false)

/**
 * @description 对话框标题
 */
const dialogTitle = computed(() => {
  if (dialogType.value === 'add') {
    return crudOption.value.addDialogTitle
  }
  if (dialogType.value === 'edit') {
    return crudOption.value.editDialogTitle
  }
  return crudOption.value.viewDialogTitle
})

/**
 * @description 表单数据
 */
const modelForm = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  },
})

/**
 * @description table配置项
 */
const tableOption = ref<ITableOption>({
  column: [],
})

/**
 * @description search配置项
 */
const searchOption = ref<ISearchOption>({
  column: [],
})

/**
 * @description form配置项
 */
const formOption = computed<IFormOption>(() => {
  const option: IFormOption = {
    column: [],
  }
  for (let i = 0; i < crudOption.value.column.length; i++) {
    const item = cloneDeep(crudOption.value.column[i])
    if (dialogType.value === 'add') {
      // 新增模式
      if (!item.addHide) {
        option.column.push(item)
      }
    } else if (dialogType.value === 'edit') {
      // 编辑模式
      if (!item.editHide) {
        option.column.push(item)
      }
    } else {
      // 查看模式
      if (!item.viewHide) {
        option.column.push(item)
      }
    }
  }
  return option
})

/**
 * @description 搜索代理
 */
const searchProxys = new Proxy(props.search, {
  get(target, key) {
    return get(target, key)
  },
  set(target, key, value) {
    set(target, key, value)
    return true
  },
})

/**
 * @description 选择的数据
 */
const selectData = computed({
  get() {
    return props.select
  },
  set(value: any) {
    emit('update:select', value)
  },
})

/**
 * 转换search列
 * @param option 列配置
 */
const transSearchColumn = (column: ICrudColumn): ISearchColumn => {
  const result: ISearchColumn = cloneDeep(column)
  // 转换排序
  result.order = column.searchOrder || undefined
  // 转换默认值
  result.value = column.searchValue || undefined
  // 转换占位符
  result.placeholder = column.searchPlaceholder || undefined
  // 转换表单校验规则
  result.rules = column.searchRules || undefined

  return result
}

/**
 * 打开新增对话框
 */
const rowAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

const dialogEnter = (done: () => void, loading: () => void) => {}

watch(
  () => props.option as ICrudOption,
  (newVal: ICrudOption) => {
    if (newVal) {
      // crud配置项
      crudOption.value = Object.assign({}, crudOption.value, newVal)

      const searchColumns: ISearchColumn[] = []
      const tableColumns: ITableColumn[] = []
      if (newVal.column && newVal.column.length) {
        for (let i = 0; i < newVal.column.length; i++) {
          const item = newVal.column[i]
          // 处理搜索列
          if (item.search) {
            searchColumns.push(transSearchColumn(item))
          }
          // 列表
          if (!item.hide) {
            tableColumns.push(item)
          }
        }
        searchOption.value.column = searchColumns
        tableOption.value.column = tableColumns
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
  <div class="m-crud">
    <MSearch
      :model="searchProxys"
      :option="searchOption"
      :size="size || globalConfig.size"
      :permission="permission"
    >
      <!-- 搜索插槽 -->
      <template
        v-for="(slotKey, index) in Object.keys(searchSlots)"
        :key="index"
        #[slotKey]="scope"
      >
        <slot :name="slotKey + 'Search'" v-bind="scope" />
      </template>
      <!---->
    </MSearch>
    <!--顶部操作区域-->
    <div v-if="crudOption.addBtn || slots.topLeft" class="m-search-top">
      <div class="m-search-left">
        <el-button
          v-if="crudOption.addBtn && !slots.addBtn"
          :size="size || globalConfig.size"
          type="primary"
          :icon="crudOption.addBtnIcon"
          @click="rowAdd()"
        >
          {{ crudOption.addBtnText }}
        </el-button>
        <slot name="addBtn" v-bind="{ size: size || globalConfig.size }" />
        <slot name="topLeft" v-bind="{ size: size || globalConfig.size }" />
      </div>
      <div class="m-search-right">
        <slot name="topRight" v-bind="{ size: size || globalConfig.size }" />
      </div>
    </div>
    <!---->
    <!--表格-->
    <MTable
      v-model:select="selectData"
      :data="data"
      :size="size || globalConfig.size"
      :loading="loading"
      :permission="permission"
      :option="tableOption"
    >
      <!-- 列表插槽 -->
      <template
        v-for="(slotKey, index) in Object.keys(tableSlots)"
        :key="index"
        #[slotKey]="scope"
      >
        <slot :name="slotKey" v-bind="scope" />
      </template>
      <!---->
    </MTable>
    <!---->

    <!--新增/编辑/查看对话框-->
    <MDialog
      v-model="dialogVisible"
      :size="size || globalConfig.size"
      :title="dialogTitle"
      :width="crudOption.dialogWidth"
      :save-btn="dialogType !== 'view'"
      :cancel-btn="dialogType !== 'view'"
      @enter="dialogEnter"
    >
      <template #default="{ loading }">
        <!--所有类型顶部-->
        <slot
          name="allTop"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--新增/编辑类型顶部-->
        <slot
          v-if="dialogType !== 'view'"
          name="formTop"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--新增类型顶部-->
        <slot
          v-if="dialogType === 'add'"
          name="addTop"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--编辑类型顶部-->
        <slot
          v-if="dialogType === 'edit'"
          name="editTop"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--查看类型顶部-->
        <slot
          v-if="dialogType === 'view'"
          name="viewTop"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <MForm
          :loading="loading"
          :size="size || globalConfig.size"
          :option="formOption"
          :model="modelForm"
        >
          <!-- 表单插槽 -->
          <template
            v-for="(slotKey, index) in Object.keys(formSlots)"
            :key="index"
            #[slotKey]="scope"
          >
            <slot :name="slotKey + 'Form'" v-bind="scope" />
          </template>
          <!---->
        </MForm>
        <!--所有类型底部-->
        <slot
          name="allBottom"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--新增/编辑类型底部-->
        <slot
          v-if="dialogType !== 'view'"
          name="formBottom"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--新增类型底部-->
        <slot
          v-if="dialogType === 'add'"
          name="addBottom"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--编辑类型底部-->
        <slot
          v-if="dialogType === 'edit'"
          name="editBottom"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
        <!--查看类型底部-->
        <slot
          v-if="dialogType === 'view'"
          name="viewBottom"
          v-bind="{ size: size || globalConfig.size, loading: loading }"
        />
        <!---->
      </template>
    </MDialog>
    <!---->
  </div>
</template>
