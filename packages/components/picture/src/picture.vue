<template>
  <div class="m-picture">
    <el-image
      :src="src"
      :preview-src-list="previewSrcList"
      fit="cover"
      :style="{ width: imgWidth, height: imgHeight }"
      :preview-teleported="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { pictureEmits, pictureProps } from './picture'

const COMPONENT_NAME = 'MPicture'
defineOptions({
  name: COMPONENT_NAME,
})

defineProps(pictureProps)
defineEmits(pictureEmits)
</script>
