<template>
  <div
    ref="qrcodeRef"
    class="m-qrcode-box"
    :style="'justify-content: ' + alignComputed"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
// @ts-ignore
import Qrcode from 'qrcodejs2-fix'
import { qrcodeEmits, qrcodeProps } from './qrcode'

const COMPONENT_NAME = 'MQrcode'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(qrcodeProps)
const emit = defineEmits(qrcodeEmits)

const qrcodeRef = ref<any>()

const alignComputed = computed(() => {
  if (!props.align || props.align === 'left') {
    return 'flex-start'
  }
  if (props.align === 'right') {
    return 'flex-end'
  }
  return 'center'
})

watch(
  () => props.text as string,
  (newVal: string) => {
    if (!newVal) return
    setTimeout(() => {
      qrcodeRef.value.innerHTML = ''
      new Qrcode(qrcodeRef.value, {
        text: newVal,
        width: props.qrcodeWidth,
        height: props.qrcodeHeight,
      })
      const img = qrcodeRef.value.querySelector('img')
      img.onclick = () => {
        emit('click', newVal)
      }
    }, 0)
  },
  {
    immediate: true,
  }
)
</script>
