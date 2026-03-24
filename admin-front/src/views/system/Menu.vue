
  <template>
    <div class="menu-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>菜单管理</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增菜单</el-button>
          </div>
        </template>

        <el-table
          :data="tableData"
          border
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children' }"
          v-loading="loading"
          default-expand-all
        >
          <el-table-column prop="title" label="菜单标题" min-width="180">
            <template #default="{ row }">
              <el-icon v-if="row.icon" style="margin-right: 8px; vertical-align: middle;">
                <component :is="row.icon" />
              </el-icon>
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="路由名称" min-width="120" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'menu' ? 'primary' : 'success'" size="small">
                {{ row.type === 'menu' ? '菜单' : '按钮' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路由路径" min-width="150" show-overflow-tooltip />
          <el-table-column prop="component" label="组件路径" min-width="180" show-overflow-tooltip />
          <el-table-column prop="permission" label="权限标识" min-width="120" show-overflow-tooltip />
          <el-table-column prop="sort" label="排序" width="80" align="center" />
          <el-table-column prop="visible" label="可见" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.visible === 1 ? 'success' : 'info'" size="small">
                {{ row.visible === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 新增/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="700px"
        @close="handleDialogClose"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                  v-model="formData.parentId"
                  :data="menuTreeData"
                  :props="{ label: 'title', value: 'id' }"
                  placeholder="请选择上级菜单"
                  clearable
                  check-strictly
                  :render-after-expand="false"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="formData.type" @change="handleTypeChange">
                  <el-radio value="menu">菜单</el-radio>
                  <el-radio value="button">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="isButtonType ? '按钮标题' : '菜单标题'" prop="title">
                <el-input
                  v-model="formData.title"
                  :placeholder="isButtonType ? '请输入按钮标题' : '请输入菜单标题'"
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="!isButtonType" :span="12">
              <el-form-item label="路由名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入路由名称" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col v-else :span="12">
              <el-form-item label="权限标识" prop="permission">
                <el-input v-model="formData.permission" placeholder="如: asset:bridge:create" maxlength="100" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" v-if="formData.type === 'menu'">
            <el-col :span="12">
              <el-form-item label="路由路径" prop="path">
                <el-input v-model="formData.path" placeholder="如: /system/user" maxlength="200" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="formData.component" placeholder="如: views/system/User" maxlength="200" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col v-if="!isButtonType" :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-select v-model="formData.icon" placeholder="请选择图标" clearable filterable style="width: 100%">
                  <el-option
                    v-for="icon in iconOptions"
                    :key="icon.value"
                    :label="icon.label"
                    :value="icon.value"
                  >
                    <el-icon style="margin-right: 8px; vertical-align: middle;">
                      <component :is="icon.value" />
                    </el-icon>
                    <span>{{ icon.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isButtonType ? 24 : 12">
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col v-if="!isButtonType" :span="12">
              <el-form-item label="是否可见" prop="visible">
                <el-radio-group v-model="formData.visible">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio :value="1">启用</el-radio>
                  <el-radio :value="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>

  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    Plus,
    Edit,
    Delete,
    HomeFilled,
    Setting,
    User,
    Avatar,
    Menu,
    Document,
    Folder,
    List,
    DataAnalysis,
    MessageBox,
    Calendar,
    ShoppingCart,
    Goods,
    Management,
    OfficeBuilding
  } from '@element-plus/icons-vue'
  import { getMenuList, createMenu, updateMenu, deleteMenu, updateMenuStatus } from '../../api/menu'

  const loading = ref(false)
  const submitLoading = ref(false)
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增菜单')
  const formRef = ref(null)

  const tableData = ref([])
  const isButtonType = computed(() => formData.type === 'button')

  // 图标选项
  const iconOptions = [
    { label: '首页', value: 'HomeFilled' },
    { label: '设置', value: 'Setting' },
    { label: '用户', value: 'User' },
    { label: '角色', value: 'Avatar' },
    { label: '菜单', value: 'Menu' },
    { label: '文档', value: 'Document' },
    { label: '文件夹', value: 'Folder' },
    { label: '列表', value: 'List' },
    { label: '数据分析', value: 'DataAnalysis' },
    { label: '消息', value: 'MessageBox' },
    { label: '日历', value: 'Calendar' },
    { label: '购物车', value: 'ShoppingCart' },
    { label: '商品', value: 'Goods' },
    { label: '管理', value: 'Management' },
    { label: '部门', value: 'OfficeBuilding' }
  ]

  const formData = reactive({
    id: null,
    parentId: null,
    name: '',
    title: '',
    type: 'menu',
    path: '',
    component: '',
    permission: '',
    icon: '',
    sort: 0,
    visible: 1,
    status: 1
  })

  const rules = {
    title: [
      { required: true, message: '请输入菜单标题', trigger: 'blur' },
      { max: 50, message: '菜单标题不能超过50个字符', trigger: 'blur' }
    ],
    name: [
      { required: computed(() => formData.type === 'menu'), message: '请输入路由名称', trigger: 'blur' },
      { max: 50, message: '路由名称不能超过50个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择菜单类型', trigger: 'change' }
    ],
    path: [
      { required: computed(() => formData.type === 'menu'), message: '请输入路由路径', trigger: 'blur' },
      { max: 200, message: '路由路径不能超过200个字符', trigger: 'blur' }
    ],
    component: [
      { max: 200, message: '组件路径不能超过200个字符', trigger: 'blur' }
    ],
    permission: [
      { required: computed(() => formData.type === 'button'), message: '请输入权限标识', trigger: 'blur' },
      { max: 100, message: '权限标识不能超过100个字符', trigger: 'blur' }
    ],
    icon: [
      { max: 50, message: '图标不能超过50个字符', trigger: 'blur' }
    ]
  }

  const filterParentMenuTree = (menus = [], excludeId = null) => {
    return menus
      .filter((menu) => menu.type === 'menu' && menu.id !== excludeId)
      .map((menu) => ({
        ...menu,
        children: filterParentMenuTree(menu.children || [], excludeId)
      }))
  }

  // 菜单树数据（用于下拉选择）
  const menuTreeData = computed(() => {
    return filterParentMenuTree(tableData.value, formData.id)
  })

  // 构建菜单树
  const buildMenuTree = (menus, parentId = null) => {
    const tree = []
    menus.forEach(menu => {
      if (menu.parentId === parentId) {
        const children = buildMenuTree(menus, menu.id)
        if (children.length > 0) {
          tree.push({ ...menu, children })
        } else {
          tree.push(menu)
        }
      }
    })
    return tree
  }

  // 获取菜单列表
  const fetchMenuList = async () => {
    loading.value = true
    try {
      const res = await getMenuList()
      // 构建树形结构
      tableData.value = buildMenuTree(res.data || res.list || [])
    } catch (error) {
      ElMessage.error(error.message || '获取菜单列表失败')
    } finally {
      loading.value = false
    }
  }

  // 新增
  const handleAdd = () => {
    dialogTitle.value = '新增菜单'
    dialogVisible.value = true
  }

  const handleTypeChange = (type) => {
    if (type === 'button') {
      Object.assign(formData, {
        name: '',
        path: '',
        component: '',
        icon: '',
        visible: 1
      })
      return
    }

    formData.permission = ''
  }

  // 编辑
  const handleEdit = (row) => {
    dialogTitle.value = '编辑菜单'
    Object.assign(formData, {
      id: row.id,
      parentId: row.parentId,
      name: row.name,
      title: row.title,
      type: row.type,
      path: row.path,
      component: row.component,
      permission: row.permission,
      icon: row.icon,
      sort: row.sort,
      visible: row.visible,
      status: row.status
    })
    dialogVisible.value = true
  }

  // 删除
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后子菜单也会被删除！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      fetchMenuList()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 状态切换
  const handleStatusChange = async (row) => {
    try {
      await updateMenuStatus(row.id, row.status)
      ElMessage.success('状态更新成功')
    } catch (error) {
      ElMessage.error(error.message || '状态更新失败')
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  }

  const buildMenuPayload = () => ({
    ...(formData.parentId ? { parentId: formData.parentId } : {}),
    ...(formData.type === 'menu' && formData.name ? { name: formData.name } : {}),
    title: formData.title,
    type: formData.type,
    ...(formData.type === 'menu' && formData.path ? { path: formData.path } : {}),
    ...(formData.type === 'menu' && formData.component ? { component: formData.component } : {}),
    ...(formData.type === 'button' && formData.permission ? { permission: formData.permission } : {}),
    ...(formData.type === 'menu' && formData.icon ? { icon: formData.icon } : {}),
    sort: formData.sort,
    ...(formData.type === 'menu' ? { visible: formData.visible } : {}),
    status: formData.status
  })

  // 提交
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        if (formData.id && formData.parentId === formData.id) {
          ElMessage.warning('上级菜单不能选择当前菜单本身')
          return
        }

        submitLoading.value = true
        try {
          const payload = buildMenuPayload()

          if (formData.id) {
            await updateMenu(formData.id, payload)
            ElMessage.success('更新成功')
          } else {
            await createMenu(payload)
            ElMessage.success('创建成功')
          }
          dialogVisible.value = false
          fetchMenuList()
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
      parentId: null,
      name: '',
      title: '',
      type: 'menu',
      path: '',
      component: '',
      permission: '',
      icon: '',
      sort: 0,
      visible: 1,
      status: 1
    })
  }

  onMounted(() => {
    fetchMenuList()
  })
  </script>

  <style scoped>
  .menu-management {
    padding: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-table .el-table__cell) {
    padding: 8px 0;
  }
  </style>
