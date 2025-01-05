<template>
  <div class="m-dialog">
    <el-dialog
      class="m-dialog"
      :model-value="modelValue"
      :title="title"
      :width="width"
      :top="top"
      :append-to-body="appendToBody"
      :close-on-click-modal="closeOnClickModal"
      :close-onn-press-escape="closeOnnPressEscape"
      :before-close="onBeforeClose"
      :draggable="draggable"
      :destroy-on-close="destroyOnClose"
      @close="closeDialog"
    >
      <slot :loading="dialogLoading" />
      <template #footer>
        <div v-if="!slots.btns" class="dialog-footer">
          <el-button
            v-if="cancelBtn"
            :size="size || globalConfig.size"
            :icon="cancelBtnIcon"
            :loading="dialogLoading"
            @click="close"
          >
            {{ t('m.dialog.cancelText') }}
          </el-button>
          <el-button
            v-if="saveBtn"
            :size="size || globalConfig.size"
            :icon="saveBtnIcon"
            :loading="dialogLoading"
            type="primary"
            @click="enter"
          >
            {{ t('m.dialog.confirmText') }}
          </el-button>
        </div>
        <slot v-else :loading="dialogLoading" name="btns" />
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, useSlots } from 'vue'
import { useGlobalConfig } from '@m-eleplus-crud/components'
import { useLocale } from '@m-eleplus-crud/hooks'
import { dialogEmits, dialogProps } from './dialog'

const COMPONENT_NAME = 'MDialog'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(dialogProps)
const emit = defineEmits(dialogEmits)

// 插槽信息
const slots = useSlots()
// 国际化
const { t } = useLocale()
// 全局配置
const globalConfig = useGlobalConfig()

// 弹窗内是否loading
const dialogLoading = ref(false)

/**
 * @description 弹窗关闭
 */
const closeDialog = () => {
  emit('update:modelValue', false)
  emit('close')
}

/**
 * 确认
 */
const enter = () => {
  // 弹窗开始加载
  dialogLoading.value = true
  // 关闭表单
  const done = () => {
    emit('update:modelValue', false)
  }
  // 关闭加载
  const loading = () => {
    dialogLoading.value = false
  }

  emit('enter', done, loading)
}

/**
 * 关闭
 */
const close = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

/**
 * 弹窗关闭前
 * @param done 完成回调
 */
const onBeforeClose = (done: () => void) => {
  if (dialogLoading.value) {
    return false
  }
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
  }
}
</script>
