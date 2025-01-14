<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, get, set } from 'lodash-unified'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { useLocale } from '@m-eleplus-crud/hooks'
import { crudEmits, crudProps } from './crud'
import type { ISearchColumn, ISearchOption, SearchInstance } from '../../search'
import type { ITableColumn, ITableOption, TableInstance } from '../../table'
import type { ICrudColumn, ICrudOption } from './crud'
import type { FormInstance, IFormColumn, IFormOption } from '../../form'

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
  // 默认显示编辑按钮
  editBtn: true,
  // 默认显示删除按钮
  delBtn: true,
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
 * @description 搜索ref
 */
const searchRef = ref<SearchInstance>()

/**
 * @description 表单ref
 */
const formRef = ref<FormInstance>()

/**
 * @description 表格ref
 */
const tableRef = ref<TableInstance>()

/**
 * @description 对话框显示状态
 */
const dialogVisible = ref(false)

/**
 * @description 表格高度
 */
const tableHeight = ref<any>(undefined)

// 备份modelForm
const _modelForm = ref<any>()

// 备份列表index
const _rowIndex = ref(-1)

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
  // 默认显示操作栏
  menu: true,

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
  let option: IFormOption = {
    column: [],
  }
  option = transFormOption(
    Object.assign({}, option, copyObjectExcept(crudOption.value, ['column']))
  )
  for (let i = 0; i < crudOption.value.column.length; i++) {
    const item = cloneDeep(crudOption.value.column[i])
    const formColumn: IFormColumn = transFormColumn(item)

    if (dialogType.value === 'add') {
      // 新增模式
      if (!item.addHide) {
        option.column.push(formColumn)
      }
    } else if (dialogType.value === 'edit') {
      // 编辑模式
      if (!item.editHide) {
        option.column.push(formColumn)
      }
    } else {
      // 查看模式
      if (!item.viewHide) {
        option.column.push(formColumn)
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
  if (column.searchOrder) {
    result.order = column.searchOrder
  } else {
    delete result.order
  }
  // 转换默认值
  if (column.value) {
    result.value = column.searchValue
  } else {
    delete result.value
  }
  // 转换占位符
  if (column.searchPlaceholder) {
    result.placeholder = column.searchPlaceholder
  } else {
    delete result.placeholder
  }
  // 转换表单校验规则
  if (column.searchRules) {
    result.rules = column.searchRules
  } else {
    delete result.rules
  }
  // 转换栅格
  if (column.searchSpan) {
    result.span = column.searchSpan
  } else {
    delete result.span
  }

  return result
}

/**
 * 转换form列
 * @param column 列配置
 * @param type 类型
 */
const transFormColumn = (column: ICrudColumn): IFormColumn => {
  const result: IFormColumn = cloneDeep(column)
  // 转换排序
  if (column.formOrder) {
    result.order = column.formOrder
  } else {
    delete result.order
  }
  // 转换默认值
  if (column.formValue) {
    result.value = column.formValue
  } else {
    delete result.value
  }
  // 转换占位符
  if (column.formPlaceholder) {
    result.placeholder = column.formPlaceholder
  } else {
    delete result.placeholder
  }
  // 转换表单校验规则
  if (column.formRules) {
    result.rules = column.formRules
  } else {
    delete result.rules
  }
  // 转换栅格
  if (column.formSpan || column.addSpan || column.editSpan || column.viewSpan) {
    if (column.formSpan) {
      result.span = column.formSpan
    }
    if (dialogType.value === 'add' && column.addSpan) {
      result.span = column.addSpan
    } else if (dialogType.value === 'edit' && column.editSpan) {
      result.span = column.editSpan
    } else if (dialogType.value === 'view' && column.viewSpan) {
      result.span = column.viewSpan
    }
  } else {
    delete result.span
  }

  return result
}

/**
 * 转换search option
 * @param option crud option
 */
const transSearchOption = (option: ICrudOption): ISearchOption => {
  const result: ISearchOption = cloneDeep(option)
  // 转换labelWidth
  if (option.searchLabelWidth) {
    result.labelWidth = option.searchLabelWidth
  } else {
    delete result.labelWidth
  }

  return result
}

/**
 * 转换form option
 * @param option crud option
 */
const transFormOption = (option: ICrudOption): IFormOption => {
  const result: IFormOption = cloneDeep(option)
  // 转换labelWidth
  if (option.formLabelWidth) {
    result.labelWidth = option.formLabelWidth
  } else {
    delete result.labelWidth
  }

  return result
}

/**
 * @description 当前页发生改变
 */
const currentPageChange = (page: number) => {
  searchRef.value?.search(page)
}

/**
 * @description 页大小发生变化
 */
const pageSizeChange = (pageSize: number) => {
  searchProxys.limit = pageSize
  searchRef.value?.search()
}

/**
 * @description 获取表格高度
 */
const setTableHeight = () => {
  nextTick(() => {
    // 自动高度
    if (crudOption.value.height === 'auto') {
      // 表格style对象
      const tableStyle = tableRef.value?.$el
      // 分页对象
      const pageStyle: any = document.querySelector('.m-pagination-box')
      // 额外可控制高度参数
      const calcHeight: number =
        crudOption.value.calcHeight || globalConfig.value?.calcHeight || 0
      tableHeight.value =
        document.documentElement.clientHeight -
        (tableStyle?.offsetTop || 0) -
        (pageStyle?.offsetHeight || 0) -
        calcHeight
    } else {
      tableHeight.value = crudOption.value.height
    }
  })
}

/**
 * 打开新增对话框
 */
const rowAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

/**
 * @description 打开编辑修改
 */
const rowEdit = (row: any, index: number) => {
  // 备份数据
  _modelForm.value = cloneDeep(row)
  _rowIndex.value = index

  // 弹窗类型
  dialogType.value = 'edit'
  modelForm.value = cloneDeep(row)
  // 弹窗状态
  dialogVisible.value = true
}

/**
 * @description 打开详情
 */
const rowView = (row: any, index: number) => {
  // 备份数据
  _modelForm.value = cloneDeep(row)
  _rowIndex.value = index

  // 弹窗类型
  dialogType.value = 'view'
  modelForm.value = cloneDeep(row)
  // 弹窗状态
  dialogVisible.value = true
}

/**
 * @description 打开删除
 */
const rowDel = (row: any, index: number) => {
  ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('rowDel', row, index)
    })
    .catch(() => {})
}

/**
 * 对话框确认事件
 * @param done 完成
 * @param loading 结束加载
 */
const dialogEnter = async (done: () => void, loading: () => void) => {
  const valid = await formRef.value!.validForm()
  // 校验不通过
  if (!valid) {
    loading()
    return
  }

  // 表单前校验
  if (props.beforeEnter && !(await props.beforeEnter())) {
    loading()
    return
  }

  if (dialogType.value === 'add') {
    // 新增
    emit('rowSave', modelForm.value, done, loading)
  } else if (dialogType.value === 'edit') {
    // 修改
    emit('rowEdit', modelForm.value, done, loading)
  }
}

const dialogCancel = () => {
  emit('rowCancel', _modelForm.value, _rowIndex.value, dialogType.value)
}

/**
 * @description 弹窗关闭
 */
const dialogClose = () => {
  // 清空备份
  _modelForm.value = null
  _rowIndex.value = -1

  if (formRef.value) {
    formRef.value.clear()
  } else {
    emit('update:modelValue', {})
  }
}

/**
 * 复制对象到新对象，排除指定key
 * @param sourceObj 源对象
 * @param excludeKeys 排除的key
 */
const copyObjectExcept = (sourceObj: any, excludeKeys: string[] = []) => {
  const result: any = {}
  Object.keys(sourceObj).forEach((key) => {
    if (!excludeKeys.includes(key)) {
      result[key] = sourceObj[key]
    }
  })
  return result
}

watch(
  () => props.option as ICrudOption,
  (newVal: ICrudOption) => {
    if (newVal) {
      // crud配置项
      crudOption.value = Object.assign({}, crudOption.value, newVal)
      // table配置项
      tableOption.value = Object.assign(
        {},
        tableOption.value,
        copyObjectExcept(crudOption.value, ['column'])
      )
      // search配置项
      searchOption.value = transSearchOption(
        Object.assign(
          {},
          searchOption.value,
          copyObjectExcept(crudOption.value, ['column'])
        )
      )

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

onMounted(() => {
  // 设置表格高度
  if (crudOption.value.height) {
    setTableHeight()
  }
})

defineExpose({
  /**
   * @description 新增
   */
  rowAdd,
  /**
   * @description 编辑
   */
  rowEdit,
  /**
   * @description 查看
   */
  rowView,
})
</script>

<template>
  <div class="m-crud">
    <MSearch
      ref="searchRef"
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
      ref="tableRef"
      v-model:select="selectData"
      :data="data"
      :size="size || globalConfig.size"
      :loading="loading"
      :permission="permission"
      :option="tableOption"
      :height="tableHeight"
      :max-height="tableHeight"
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
      <!--操作栏-->
      <template #menu="scope">
        <el-link
          v-if="crudOption.editBtn && !slots.editBtn"
          class="m-control-btns"
          type="primary"
          :size="size || globalConfig.size"
          :underline="false"
          icon="Edit"
          @click="rowEdit(scope.row, scope.$index)"
        >
          {{ t('m.crud.editBtnText') }}
        </el-link>
        <slot
          v-if="crudOption.editBtn && slots.editBtn"
          name="editBtn"
          v-bind="scope"
        />
        <el-link
          v-if="crudOption.delBtn && !slots.delBtn"
          class="m-control-btns"
          type="primary"
          :underline="false"
          :size="size || globalConfig.size"
          icon="Delete"
          @click="rowDel(scope.row, scope.$index)"
        >
          {{ t('m.crud.delBtnText') }}
        </el-link>
        <slot
          v-if="crudOption.delBtn && slots.delBtn"
          name="delBtn"
          v-bind="scope"
        />
      </template>
      <!---->
    </MTable>
    <!---->
    <!--分页区域-->
    <div v-if="searchProxys.page && total" class="m-pagination-box">
      <m-pagination
        :small="(size || globalConfig.size) === 'small'"
        :total="total"
        :current-page="searchProxys.page"
        :page-size="searchProxys.limit"
        :disabled="loading"
        @current-page="currentPageChange"
        @page-size="pageSizeChange"
      />
    </div>
    <!--新增/编辑/查看对话框-->
    <MDialog
      v-model="dialogVisible"
      :size="size || globalConfig.size"
      :title="dialogTitle"
      :width="crudOption.dialogWidth"
      :save-btn="dialogType !== 'view'"
      :cancel-btn="dialogType !== 'view'"
      @enter="dialogEnter"
      @cancel="dialogCancel"
      @close="dialogClose"
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
          ref="formRef"
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
