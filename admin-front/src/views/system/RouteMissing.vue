<template>
  <div class="route-missing">
    <el-card class="missing-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>页面未接入</span>
          <el-tag type="warning" effect="light">组件路径未匹配</el-tag>
        </div>
      </template>

      <p class="title">{{ route.meta?.title || '未命名页面' }}</p>
      <p class="description">
        当前菜单已经注册成动态路由，但它填写的组件路径在前端项目中没有找到对应页面。
      </p>

      <div class="path-box">
        <span>组件路径：</span>
        <code>{{ route.meta?.componentPath || '未配置' }}</code>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.route-missing {
  padding: 0;
}

.missing-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(17, 24, 39, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
}

.title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2d3d;
}

.description {
  margin: 0 0 18px;
  color: #5c7085;
  line-height: 1.8;
}

.path-box {
  padding: 14px 16px;
  border-radius: 14px;
  background: #f7fafc;
  color: #31475e;
}

.path-box code {
  font-family: Consolas, Monaco, monospace;
  color: #0f5cab;
}
</style>
