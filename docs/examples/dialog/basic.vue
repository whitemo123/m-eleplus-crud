<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}
</script>

<template>
  <div>
    <el-button @click="openDialog">打开弹窗</el-button>
    <MDialog v-model="dialogVisible" title="标题">
      <template #default="{ loading }">
        <span>我是内容</span>
      </template>
    </MDialog>
  </div>
</template>

<style lang="scss" scoped></style>
