<template>
  <div class="department-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增部门</el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="name" label="部门名称" min-width="180" />
        <el-table-column prop="code" label="部门编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="leaderName" label="负责人" min-width="120" />
        <el-table-column prop="phone" label="电话" min-width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="680px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="96px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="departmentTreeOptions"
                :props="{ label: 'name', value: 'id' }"
                placeholder="请选择上级部门"
                check-strictly
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leaderId">
              <el-select
                v-model="formData.leaderId"
                placeholder="请选择负责人"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="user in leaderOptions"
                  :key="user.id"
                  :label="user.label"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入部门名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入部门编码" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入部门电话" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入部门邮箱" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入部门描述"
            :rows="3"
            maxlength="200"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getDepartmentList,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../../api/department'
import { getUserList } from '../../api/user'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const formRef = ref(null)

const tableData = ref([])
const rawDepartmentTree = ref([])
const leaderOptions = ref([])

const formData = reactive({
  id: null,
  parentId: null,
  leaderId: null,
  name: '',
  code: '',
  phone: '',
  email: '',
  sort: 0,
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { max: 50, message: '部门名称不能超过50个字符', trigger: 'blur' }
  ],
  code: [
    { max: 50, message: '部门编码不能超过50个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { max: 20, message: '电话不能超过20个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '部门描述不能超过200个字符', trigger: 'blur' }
  ]
}

const leaderMap = computed(() => {
  return leaderOptions.value.reduce((map, item) => {
    map[item.id] = item.label
    return map
  }, {})
})

const departmentTreeOptions = computed(() => rawDepartmentTree.value)

const decorateDepartmentTree = (departments = []) => {
  return departments.map((department) => ({
    ...department,
    leaderName: department.leaderId ? (leaderMap.value[department.leaderId] || `用户#${department.leaderId}`) : '-',
    phone: department.phone || '-',
    email: department.email || '-',
    code: department.code || '-',
    children: decorateDepartmentTree(department.children || [])
  }))
}

const fetchLeaderOptions = async () => {
  try {
    const res = await getUserList({ page: 1, pageSize: 1000 })
    const users = res.data?.list || res.data || res.list || []
    leaderOptions.value = users.map((user) => ({
      id: user.id,
      label: user.nickname ? `${user.username} (${user.nickname})` : user.username
    }))
  } catch (error) {
    leaderOptions.value = []
  }
}

const fetchDepartmentList = async () => {
  loading.value = true
  try {
    const res = await getDepartmentList()
    rawDepartmentTree.value = res.data || res.list || []
    tableData.value = decorateDepartmentTree(rawDepartmentTree.value)
  } catch (error) {
    ElMessage.error(error.message || '获取部门列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增部门'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑部门'
  Object.assign(formData, {
    id: row.id,
    parentId: row.parentId,
    leaderId: row.leaderId,
    name: row.name,
    code: row.code === '-' ? '' : row.code,
    phone: row.phone === '-' ? '' : row.phone,
    email: row.email === '-' ? '' : row.email,
    sort: row.sort || 0,
    description: row.description || ''
  })
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteDepartment(row.id)
    ElMessage.success('删除成功')
    fetchDepartmentList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const buildDepartmentPayload = () => ({
  name: formData.name,
  ...(formData.code ? { code: formData.code } : {}),
  ...(formData.parentId ? { parentId: formData.parentId } : {}),
  ...(formData.leaderId ? { leaderId: formData.leaderId } : {}),
  ...(formData.phone ? { phone: formData.phone } : {}),
  ...(formData.email ? { email: formData.email } : {}),
  ...(formData.sort ? { sort: formData.sort } : {}),
  ...(formData.description ? { description: formData.description } : {})
})

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const payload = buildDepartmentPayload()

        if (formData.id) {
          await updateDepartment(formData.id, payload)
          ElMessage.success('更新成功')
        } else {
          await createDepartment(payload)
          ElMessage.success('创建成功')
        }

        dialogVisible.value = false
        await fetchDepartmentList()
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: null,
    parentId: null,
    leaderId: null,
    name: '',
    code: '',
    phone: '',
    email: '',
    sort: 0,
    description: ''
  })
}

onMounted(async () => {
  await fetchLeaderOptions()
  await fetchDepartmentList()
})
</script>

<style scoped>
.department-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
