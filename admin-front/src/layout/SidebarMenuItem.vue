<template>
  <el-sub-menu v-if="visibleChildren.length > 0" :index="menuIndex">
    <template #title>
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>

    <SidebarMenuItem
      v-for="child in visibleChildren"
      :key="child.id"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="menuIndex">
    <el-icon v-if="item.icon">
      <component :is="item.icon" />
    </el-icon>
    <template #title>{{ item.title }}</template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'
import { getMenuItemIndex, getRenderableMenus } from '../router/menuRuntime'

defineOptions({
  name: 'SidebarMenuItem'
})

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const visibleChildren = computed(() => getRenderableMenus(props.item.children || []))
const menuIndex = computed(() => getMenuItemIndex(props.item))
</script>
