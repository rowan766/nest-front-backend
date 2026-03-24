<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">1,234</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">5,678</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">9,012</div>
              <div class="stat-label">评论总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">34,567</div>
              <div class="stat-label">访问总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus">新增用户</el-button>
            <el-button type="success" :icon="Edit">编辑内容</el-button>
            <el-button type="warning" :icon="Setting">系统设置</el-button>
            <el-button type="info" :icon="Document">查看报表</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统版本：</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Vue版本：</span>
              <span class="info-value">v3.5.22</span>
            </div>
            <div class="info-item">
              <span class="info-label">Element Plus：</span>
              <span class="info-value">v2.11.7</span>
            </div>
            <div class="info-item">
              <span class="info-label">运行时间：</span>
              <span class="info-value">{{ runningTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新动态</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <el-card>
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  User,
  Document,
  ChatDotRound,
  View,
  Plus,
  Edit,
  Setting
} from '@element-plus/icons-vue'

const runningTime = ref('0天0小时0分钟')
let timer = null

const activities = ref([
  {
    title: '系统更新',
    content: '系统已更新至v1.0.0版本',
    timestamp: '2024-11-06 10:00:00'
  },
  {
    title: '新用户注册',
    content: '用户"张三"成功注册',
    timestamp: '2024-11-06 09:30:00'
  },
  {
    title: '数据备份',
    content: '系统完成自动数据备份',
    timestamp: '2024-11-06 08:00:00'
  },
  {
    title: '安全检查',
    content: '系统安全检查已完成，未发现异常',
    timestamp: '2024-11-06 06:00:00'
  }
])

const updateRunningTime = () => {
  const startTime = new Date('2024-11-01 00:00:00')
  const now = new Date()
  const diff = now - startTime

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  runningTime.value = `${days}天${hours}小时${minutes}分钟`
}

onMounted(() => {
  updateRunningTime()
  timer = setInterval(updateRunningTime, 60000) // 每分钟更新一次
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.content-row {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-label {
  color: #666;
  min-width: 120px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 13px;
}
</style>
