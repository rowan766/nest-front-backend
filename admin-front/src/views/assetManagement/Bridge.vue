<template>
  <div class="bridge-page">
    <AssetPlaceholder
      title="桥梁管理"
      description="桥梁管理模块占位页已创建，后续可以在这里接入桥梁台账、结构信息、巡检记录和状态评估等业务能力。"
    />

    <el-card class="action-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>按钮权限演示</span>
          <el-tag type="success" effect="light">基于当前登录角色</el-tag>
        </div>
      </template>

      <div class="action-toolbar">
        <el-button v-permission="'asset:bridge:create'" type="primary">新增桥梁</el-button>
        <el-button v-permission="'asset:bridge:update'">编辑桥梁</el-button>
        <el-button v-permission="'asset:bridge:delete'" type="danger">删除桥梁</el-button>
      </div>

      <el-empty
        v-if="!hasAnyPermission(bridgePermissions)"
        description="当前账号没有桥梁管理按钮权限"
      />

      <div class="permission-summary">
        <span class="summary-label">当前桥梁页权限：</span>
        <el-tag
          v-for="permission in grantedBridgePermissions"
          :key="permission"
          type="info"
          effect="plain"
        >
          {{ permission }}
        </el-tag>
        <span v-if="grantedBridgePermissions.length === 0" class="summary-empty">无</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AssetPlaceholder from './components/AssetPlaceholder.vue'
import { usePermission } from '../../composables/usePermission'

const bridgePermissions = [
  'asset:bridge:create',
  'asset:bridge:update',
  'asset:bridge:delete'
]

const { hasPermission, hasAnyPermission } = usePermission()

const grantedBridgePermissions = computed(() => {
  return bridgePermissions.filter((permission) => hasPermission(permission))
})
</script>

<style scoped>
.bridge-page {
  display: grid;
  gap: 20px;
}

.action-card {
  border: none;
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(18, 38, 63, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
}

.action-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.permission-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.summary-label {
  color: #4e657b;
  font-weight: 600;
}

.summary-empty {
  color: #8b9cae;
}
</style>
