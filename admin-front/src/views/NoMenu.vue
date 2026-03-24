<template>
  <div class="no-menu-page">
    <el-card class="no-menu-card" shadow="never">
      <div class="content">
        <p class="eyebrow">访问受限</p>
        <h1>当前账号未分配菜单权限</h1>
        <p class="description">
          你的账号已登录成功，但还没有可访问的菜单。请联系管理员为当前用户分配菜单权限后，再重新登录系统。
        </p>

        <div class="actions">
          <el-button type="primary" @click="handleRefresh">重新检查</el-button>
          <el-button @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleRefresh = async () => {
  await userStore.ensureUserContext({ refreshMenus: true })
  router.replace('/')
}

const handleLogout = () => {
  userStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
.no-menu-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 32px 16px;
}

.no-menu-card {
  width: min(720px, 100%);
  border: none;
  border-radius: 28px;
  box-shadow: 0 20px 48px rgba(19, 39, 63, 0.12);
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.92), transparent 36%),
    linear-gradient(135deg, #f3f8ff 0%, #eef7f2 100%);
}

.content {
  padding: 24px 12px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #6c7f95;
}

.content h1 {
  margin: 0;
  font-size: 30px;
  color: #1d3148;
}

.description {
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 1.8;
  color: #546b82;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}
</style>
