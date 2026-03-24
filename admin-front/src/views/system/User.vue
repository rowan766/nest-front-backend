<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="departmentName" label="所属部门" min-width="160" show-overflow-tooltip />
        <el-table-column prop="roleNames" label="角色" width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="290" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" size="small" :icon="UserFilled" @click="handleAssignRoles(row)">角色</el-button>
            <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-tree-select
            v-model="formData.departmentId"
            :data="departmentTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择所属部门"
            check-strictly
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!formData.id">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="roleDialogVisible"
      :title="roleDialogTitle"
      width="520px"
      @close="handleRoleDialogClose"
    >
      <div v-loading="roleDialogLoading">
        <el-form label-width="80px">
          <el-form-item label="角色分配">
            <el-select
              v-model="selectedRoleIds"
              multiple
              clearable
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="role in roleOptions"
                :key="role.id"
                :label="role.name"
                :value="role.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="roleSubmitLoading" @click="handleRoleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, UserFilled } from '@element-plus/icons-vue'
import { getUserList, createUser, updateUser, deleteUser, getUserDetail, assignUserRoles } from '../../api/user'
import { getDepartmentList } from '../../api/department'
import { getRoleList } from '../../api/role'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref(null)
const departmentTree = ref([])
const roleDialogVisible = ref(false)
const roleDialogTitle = ref('分配角色')
const roleDialogLoading = ref(false)
const roleSubmitLoading = ref(false)
const roleOptions = ref([])
const selectedRoleIds = ref([])
const currentRoleUserId = ref(null)

const searchForm = reactive({
  username: '',
  email: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableData = ref([])

const formData = reactive({
  id: null,
  username: '',
  email: '',
  departmentId: null,
  password: '',
  status: 1
})

const departmentTreeOptions = computed(() => departmentTree.value)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await getUserList(params)
    const users = res.data?.list || res.data || res.list || []
    tableData.value = users.map(user => ({
      ...user,
      departmentName: user.department?.name || '-',
      roleNames: user.roles?.map(item => item.role?.name).filter(Boolean).join('、') || '-'
    }))
    pagination.total = res.data?.total || res.total || tableData.value.length
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    // 使用模拟数据
    tableData.value = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        roleNames: '管理员',
        status: 1,
        createdAt: '2024-11-01 10:00:00'
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        roleNames: '普通用户',
        status: 1,
        createdAt: '2024-11-02 11:00:00'
      }
    ]
    pagination.total = 2
  } finally {
    loading.value = false
  }
}

const fetchDepartmentTree = async () => {
  try {
    const res = await getDepartmentList()
    departmentTree.value = res.data || res.list || []
  } catch (error) {
    departmentTree.value = []
    ElMessage.error(error.message || '获取部门列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    email: row.email || '',
    departmentId: row.departmentId || null,
    password: '',
    status: row.status ?? 1
  })
  dialogVisible.value = true
}

const fetchRoleOptions = async () => {
  const res = await getRoleList({ page: 1, pageSize: 1000 })
  roleOptions.value = res.data?.list || res.data || res.list || []
}

const extractUserRoleIds = (user) => {
  return (user?.roles || [])
    .map((item) => item.roleId ?? item.role?.id)
    .filter((id) => typeof id === 'number')
}

const handleAssignRoles = async (row) => {
  currentRoleUserId.value = row.id
  roleDialogTitle.value = `分配角色 - ${row.username}`
  roleDialogVisible.value = true
  roleDialogLoading.value = true

  try {
    const [roleRes, userRes] = await Promise.all([
      getRoleList({ page: 1, pageSize: 1000 }),
      getUserDetail(row.id)
    ])

    roleOptions.value = roleRes.data?.list || roleRes.data || roleRes.list || []
    const userDetail = userRes.data || userRes
    selectedRoleIds.value = extractUserRoleIds(userDetail)
  } catch (error) {
    ElMessage.error(error.message || '获取角色分配信息失败')
    roleDialogVisible.value = false
  } finally {
    roleDialogLoading.value = false
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleRoleSubmit = async () => {
  if (!currentRoleUserId.value) return

  roleSubmitLoading.value = true
  try {
    await assignUserRoles(currentRoleUserId.value, selectedRoleIds.value)
    ElMessage.success('角色分配成功')
    roleDialogVisible.value = false
    await fetchUserList()
  } catch (error) {
    ElMessage.error(error.message || '角色分配失败')
  } finally {
    roleSubmitLoading.value = false
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const payload = {
          username: formData.username,
          email: formData.email,
          ...(formData.departmentId ? { departmentId: formData.departmentId } : {}),
          status: formData.status
        }

        if (formData.id) {
          await updateUser(formData.id, payload)
          ElMessage.success('更新成功')
        } else {
          await createUser({
            ...payload,
            password: formData.password
          })
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchUserList()
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: null,
    username: '',
    email: '',
    departmentId: null,
    password: '',
    status: 1
  })
}

const handleRoleDialogClose = () => {
  currentRoleUserId.value = null
  roleDialogTitle.value = '分配角色'
  selectedRoleIds.value = []
}

// 分页
const handleSizeChange = () => {
  fetchUserList()
}

const handleCurrentChange = () => {
  fetchUserList()
}

onMounted(() => {
  fetchDepartmentTree()
  fetchRoleOptions()
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
