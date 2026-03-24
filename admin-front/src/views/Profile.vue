<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>

      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="120" :src="avatarUrl" class="user-avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
        </div>

        <div class="info-section">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userStore.userInfo?.username || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userStore.userInfo?.nickname || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userStore.userInfo?.email || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ userStore.userInfo?.phone || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ getGenderText(userStore.userInfo?.gender) }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="userStore.userInfo?.status === 1 ? 'success' : 'danger'">
                {{ userStore.userInfo?.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(userStore.userInfo?.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后登录时间">
              {{ formatDate(userStore.userInfo?.lastLoginAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="action-section">
        <el-button type="primary" @click="handleEditProfile">
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <el-button @click="handleChangePassword">
          <el-icon><Lock /></el-icon>
          修改密码
        </el-button>
      </div>
    </el-card>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑资料" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio :value="0">未知</el-radio>
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="500px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Edit, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// 头像URL - 根据avatarId生成
const avatarUrl = computed(() => {
  console.log('6666=>',userStore.userInfo)
  const avatarId = userStore.userInfo?.avatarId

  if (avatarId) {
    // 使用与request.js相同的baseURL配置
    const baseURL = import.meta.env.DEV ? '/api' : 'http://8.130.84.165:3001'
    return `${baseURL}/upload/image/${avatarId}?download=false`
    console.log('7777=>',baseURL)
  }
  return ''
})

// 编辑资料对话框
const editDialogVisible = ref(false)
const editForm = ref({
  nickname: '',
  email: '',
  phone: '',
  gender: 0
})

// 修改密码对话框
const passwordDialogVisible = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 性别文本转换
const getGenderText = (gender) => {
  const genderMap = {
    0: '未知',
    1: '男',
    2: '女'
  }
  return genderMap[gender] || '未知'
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 编辑资料
const handleEditProfile = () => {
  editForm.value = {
    nickname: userStore.userInfo?.nickname || '',
    email: userStore.userInfo?.email || '',
    phone: userStore.userInfo?.phone || '',
    gender: userStore.userInfo?.gender || 0
  }
  editDialogVisible.value = true
}

// 保存资料
const handleSaveProfile = () => {
  // TODO: 调用API保存用户资料
  ElMessage.info('保存资料功能开发中')
  editDialogVisible.value = false
}

// 修改密码
const handleChangePassword = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordDialogVisible.value = true
}

// 保存密码
const handleSavePassword = () => {
  if (!passwordForm.value.oldPassword) {
    ElMessage.warning('请输入原密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.warning('密码长度不能少于6位')
    return
  }

  // TODO: 调用API修改密码
  ElMessage.info('修改密码功能开发中')
  passwordDialogVisible.value = false
}
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.user-avatar {
  border: 3px solid #e6e6e6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-top: 20px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e6e6e6;
}

:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}

:deep(.el-descriptions__content) {
  color: #606266;
}
</style>
