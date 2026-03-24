<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
      <div class="logo">
        <span v-if="!isCollapse">后台管理</span>
        <span v-else>后台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#ffffff"
        router
        class="layout-menu"
      >
        <SidebarMenuItem
          v-for="menu in menuTree"
          :key="menu.id"
          :item="menu"
        />
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-icon><UserFilled /></el-icon>
              <span>{{ userStore.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  UserFilled,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import SidebarMenuItem from './SidebarMenuItem.vue'
import { findOpenMenuIndexes, getRenderableMenus } from '../router/menuRuntime'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)
const menuTree = computed(() => getRenderableMenus(userStore.menus))
const defaultOpeneds = computed(() => findOpenMenuIndexes(menuTree.value, route.path))

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      userStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    } catch (error) {
      // 用户取消
    }
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background: linear-gradient(180deg, #2c3a4d 0%, #243244 100%);
  transition: width 0.3s;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.06);
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  letter-spacing: 0.06em;
  background: rgba(14, 23, 38, 0.24);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.05);
}

.layout-menu {
  border-right: none;
  background: transparent;
  --menu-bg-hover: #35465d;
  --menu-bg-active: linear-gradient(135deg, #4f9dff 0%, #2f7ef7 100%);
  --menu-text: #bfcbd9;
  --menu-text-muted: #8fa3ba;
}

.layout-menu:not(.el-menu--collapse) {
  width: 200px;
}

:deep(.el-menu) {
  border-right: none;
  background: transparent;
}

:deep(.el-sub-menu .el-menu) {
  background: rgba(17, 26, 39, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03),
    inset 0 -1px 0 rgba(0, 0, 0, 0.08);
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 48px;
  margin: 6px 10px;
  border-radius: 12px;
  color: var(--menu-text);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: var(--menu-bg-hover) !important;
  color: #ffffff;
  transform: translateX(2px);
}

:deep(.el-menu-item.is-active) {
  background: var(--menu-bg-active) !important;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(47, 126, 247, 0.28);
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title),
:deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  margin: 4px 10px 4px 18px;
  padding-left: 40px !important;
  color: var(--menu-text-muted);
  background: transparent !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background: rgba(79, 157, 255, 0.14) !important;
  color: #ffffff;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(79, 157, 255, 0.22) 0%, rgba(47, 126, 247, 0.36) 100%) !important;
  color: #ffffff;
  box-shadow: inset 3px 0 0 #74b4ff;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  color: inherit;
}

:deep(.el-sub-menu__icon-arrow) {
  color: rgba(255, 255, 255, 0.72);
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.collapse-icon:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.layout-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
