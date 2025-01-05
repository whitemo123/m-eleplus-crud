<template>
  <img ref="barcodeRef" class="m-barcode-box" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import JsBarcode from 'jsbarcode'
import { barcodeEmits, barcodeProps } from './barcode'

const COMPONENT_NAME = 'MBarcode'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(barcodeProps)
const emit = defineEmits(barcodeEmits)

const barcodeRef = ref<any>()

watch(
  () => props.text as string,
  (newVal: string) => {
    if (!newVal) return
    setTimeout(() => {
      barcodeRef.value.innerHTML = ''
      JsBarcode(barcodeRef.value, newVal, {
        format: 'CODE128',
        lineColor: '#000',
        width: props.barcodeWidth,
        height: props.barcodeHeight,
        displayValue: false,
      })
      barcodeRef.value.onclick = () => {
        emit('click', newVal)
      }
    }, 0)
  },
  {
    immediate: true,
  }
)
</script>
