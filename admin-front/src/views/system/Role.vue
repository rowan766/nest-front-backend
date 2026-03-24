 <template>
    <div class="role-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>角色管理</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
          </div>
        </template>

        <div class="search-bar">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="角色名称">
              <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable />
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="searchForm.code" placeholder="请输入角色编码" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="角色名称" min-width="120" />
          <el-table-column prop="code" label="角色编码" min-width="120" />
          <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
          <el-table-column prop="dataScope" label="数据权限" width="120">
            <template #default="{ row }">
              {{ getDataScopeLabel(row.dataScope) }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="160" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" :icon="Setting" @click="handlePermission(row)">权限</el-button>
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
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入角色名称" maxlength="50" />
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="formData.code" placeholder="请输入角色编码" maxlength="50" :disabled="!!formData.id" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" :rows="3" maxlength="200" />
          </el-form-item>
          <el-form-item label="数据权限" prop="dataScope">
            <el-select v-model="formData.dataScope" placeholder="请选择数据权限范围">
              <el-option label="全部数据" :value="1" />
              <el-option label="本部门及以下" :value="2" />
              <el-option label="本部门" :value="3" />
              <el-option label="仅本人" :value="4" />
              <el-option label="自定义" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="0" :max="9999" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
        </template>
      </el-dialog>

      <!-- 权限配置对话框 -->
      <el-dialog
        v-model="permissionDialogVisible"
        :title="permissionDialogTitle"
        width="600px"
        @close="handlePermissionDialogClose"
      >
        <div v-loading="permissionLoading" class="permission-tree-wrapper">
          <el-empty
            v-if="!permissionLoading && permissionTree.length === 0"
            description="暂无可配置的菜单权限"
          />
          <el-tree
            v-else
            ref="treeRef"
            :data="permissionTree"
            :props="{ label: 'label', children: 'children' }"
            show-checkbox
            node-key="id"
            default-expand-all
            check-strictly
            :check-on-click-node="true"
            :default-checked-keys="checkedKeys"
          />
        </div>
        <template #footer>
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="permissionSubmitLoading" @click="handlePermissionSubmit">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>

  <script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Search, Refresh, Edit, Delete, Setting } from '@element-plus/icons-vue'
  import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    getRoleDetail,
    setRoleMenu
  } from '../../api/role'
  import { getMenuList } from '../../api/menu'

  const loading = ref(false)
  const submitLoading = ref(false)
  const dialogVisible = ref(false)
  const permissionDialogVisible = ref(false)
  const permissionLoading = ref(false)
  const permissionSubmitLoading = ref(false)
  const dialogTitle = ref('新增角色')
  const permissionDialogTitle = ref('权限配置')
  const formRef = ref(null)
  const treeRef = ref(null)
  const currentPermissionRoleId = ref(null)
  const permissionParentMap = ref(new Map())

  const searchForm = reactive({
    name: '',
    code: '',
    status: null
  })

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const tableData = ref([])

  const formData = reactive({
    id: null,
    name: '',
    code: '',
    description: '',
    dataScope: 1,
    sort: 0,
    status: 1
  })

  const rules = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { max: 50, message: '角色名称不能超过50个字符', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入角色编码', trigger: 'blur' },
      { max: 50, message: '角色编码不能超过50个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '角色编码只能包含字母、数字和下划线，且不能以数字开头', trigger:
  'blur' }
    ],
    description: [
      { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
    ],
    dataScope: [
      { required: true, message: '请选择数据权限范围', trigger: 'change' }
    ],
    sort: [
      { required: true, message: '请输入排序值', trigger: 'blur' }
    ]
  }

  const permissionTree = ref([])

  const checkedKeys = ref([])

  const buildPermissionTree = (menus = [], parentId = null) => {
    return menus.map((menu) => ({
      id: menu.id,
      parentId,
      label: menu.title || menu.name || (menu.type === 'button' ? menu.permission : `菜单#${menu.id}`),
      type: menu.type,
      permission: menu.permission,
      children: buildPermissionTree(menu.children || [], menu.id)
    }))
  }

  const buildPermissionParentMap = (nodes = [], map = new Map()) => {
    nodes.forEach((node) => {
      map.set(node.id, node.parentId)

      if (node.children?.length) {
        buildPermissionParentMap(node.children, map)
      }
    })

    return map
  }

  const extractRoleMenuIds = (roleDetail) => {
    return (roleDetail?.menus || [])
      .map((item) => item.menuId ?? item.menu?.id)
      .filter((id) => typeof id === 'number')
  }

  // 数据权限范围标签
  const getDataScopeLabel = (dataScope) => {
    const map = {
      1: '全部',
      2: '本部门及以下',
      3: '本部门',
      4: '仅本人',
      5: '自定义'
    }
    return map[dataScope] || '-'
  }

  // 获取角色列表
  const fetchRoleList = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }
      const res = await getRoleList(params)
      tableData.value = res.data?.list || res.data || res.list || []
      pagination.total = res.data?.total || res.total || tableData.value.length
    } catch (error) {
      ElMessage.error(error.message || '获取角色列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.page = 1
    fetchRoleList()
  }

  // 重置
  const handleReset = () => {
    searchForm.name = ''
    searchForm.code = ''
    searchForm.status = null
    handleSearch()
  }

  // 新增
  const handleAdd = () => {
    dialogTitle.value = '新增角色'
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row) => {
    dialogTitle.value = '编辑角色'
    Object.assign(formData, {
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      dataScope: row.dataScope,
      sort: row.sort,
      status: row.status
    })
    dialogVisible.value = true
  }

  // 删除
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      fetchRoleList()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 状态切换
  const handleStatusChange = async (row) => {
    try {
      await updateRoleStatus(row.id, row.status)
      ElMessage.success('状态更新成功')
    } catch (error) {
      ElMessage.error(error.message || '状态更新失败')
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  }

  // 权限配置
  const handlePermission = async (row) => {
    currentPermissionRoleId.value = row.id
    permissionDialogTitle.value = `权限配置 - ${row.name}`
    checkedKeys.value = []
    permissionTree.value = []
    permissionDialogVisible.value = true
    permissionLoading.value = true

    try {
      const [menuRes, roleRes] = await Promise.all([
        getMenuList(),
        getRoleDetail(row.id)
      ])

      const menuTree = menuRes.data || menuRes.list || []
      const roleDetail = roleRes.data || roleRes
      const roleMenuIds = extractRoleMenuIds(roleDetail)

      permissionTree.value = buildPermissionTree(menuTree)
      permissionParentMap.value = buildPermissionParentMap(permissionTree.value)
      checkedKeys.value = roleMenuIds

      await nextTick()
      treeRef.value?.setCheckedKeys(roleMenuIds)
    } catch (error) {
      ElMessage.error(error.message || '获取权限配置失败')
      permissionDialogVisible.value = false
    } finally {
      permissionLoading.value = false
    }
  }

  const buildRolePayload = () => ({
    name: formData.name,
    code: formData.code,
    description: formData.description,
    dataScope: formData.dataScope,
    sort: formData.sort,
    status: formData.status
  })

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        submitLoading.value = true
        try {
          const payload = buildRolePayload()

          if (formData.id) {
            await updateRole(formData.id, payload)
            ElMessage.success('更新成功')
          } else {
            await createRole(payload)
            ElMessage.success('创建成功')
          }
          dialogVisible.value = false
          fetchRoleList()
        } catch (error) {
          ElMessage.error(error.message || '操作失败')
        } finally {
          submitLoading.value = false
        }
      }
    })
  }

  // 提交权限配置
  const handlePermissionSubmit = async () => {
    if (!currentPermissionRoleId.value || !treeRef.value) return

    permissionSubmitLoading.value = true

    try {
      const checkedMenuIds = treeRef.value.getCheckedKeys(false)
      const menuIds = new Set(checkedMenuIds)

      checkedMenuIds.forEach((menuId) => {
        let parentId = permissionParentMap.value.get(menuId)

        while (typeof parentId === 'number') {
          menuIds.add(parentId)
          parentId = permissionParentMap.value.get(parentId)
        }
      })

      await setRoleMenu(currentPermissionRoleId.value, Array.from(menuIds))
      ElMessage.success('权限配置成功')
      permissionDialogVisible.value = false
      await fetchRoleList()
    } catch (error) {
      ElMessage.error(error.message || '权限配置失败')
    } finally {
      permissionSubmitLoading.value = false
    }
  }

  const handlePermissionDialogClose = () => {
    currentPermissionRoleId.value = null
    permissionDialogTitle.value = '权限配置'
    permissionTree.value = []
    checkedKeys.value = []
    permissionParentMap.value = new Map()
    treeRef.value?.setCheckedKeys([])
  }

  // 对话框关闭
  const handleDialogClose = () => {
    formRef.value?.resetFields()
    Object.assign(formData, {
      id: null,
      name: '',
      code: '',
      description: '',
      dataScope: 1,
      sort: 0,
      status: 1
    })
  }

  // 分页
  const handleSizeChange = () => {
    fetchRoleList()
  }

  const handleCurrentChange = () => {
    fetchRoleList()
  }

  onMounted(() => {
    fetchRoleList()
  })
  </script>

  <style scoped>
  .role-management {
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

  .permission-tree-wrapper {
    min-height: 240px;
  }
  </style>
