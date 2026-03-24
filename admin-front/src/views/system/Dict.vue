
  <template>
    <div class="dict-management">
      <el-row :gutter="20">
        <!-- 左侧：字典类型 -->
        <el-col :span="10">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>字典类型</span>
                <el-button type="primary" size="small" :icon="Plus" @click="handleAddType">新增</el-button>
              </div>
            </template>

            <el-table
              ref="typeTableRef"
              :data="typeTableData"
              border
              style="width: 100%"
              v-loading="typeLoading"
              highlight-current-row
              @current-change="handleTypeSelect"
            >
              <el-table-column prop="name" label="字典名称" min-width="120" show-overflow-tooltip />
              <el-table-column prop="code" label="字典编码" min-width="120" show-overflow-tooltip />
              <el-table-column prop="status" label="状态" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="{ row }">
                  <el-button type="primary" size="small" link :icon="Edit" @click="handleEditType(row)">编辑</el-button>
                  <el-button type="danger" size="small" link :icon="Delete" @click="handleDeleteType(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination" v-if="typePagination.total > 0">
              <el-pagination
                v-model:current-page="typePagination.page"
                v-model:page-size="typePagination.pageSize"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                :total="typePagination.total"
                size="small"
                @size-change="fetchTypeList"
                @current-change="fetchTypeList"
              />
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：字典数据 -->
        <el-col :span="14">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>字典数据 <span v-if="currentType" class="type-name">（{{ currentType.name }}）</span></span>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Plus"
                  @click="handleAddData"
                  :disabled="!currentType"
                >新增</el-button>
              </div>
            </template>

            <el-empty v-if="!currentType" description="请先选择字典类型" />

            <template v-else>
              <el-table
                ref="dataTableRef"
                :data="dataTableData"
                border
                style="width: 100%"
                v-loading="dataLoading"
                highlight-current-row
                @current-change="handleDataSelect"
              >
                <el-table-column prop="label" label="字典标签" min-width="120" />
                <el-table-column prop="value" label="字典值" min-width="100" />
                <el-table-column prop="sort" label="排序" width="80" align="center" />
                <el-table-column prop="cssClass" label="样式类" min-width="100" show-overflow-tooltip />
                <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
                <el-table-column prop="status" label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.status"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleDataStatusChange(row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" link :icon="Edit" @click="handleEditData(row)">编辑</el-button>
                    <el-button type="danger" size="small" link :icon="Delete" @click="handleDeleteData(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pagination" v-if="dataPagination.total > 0">
                <el-pagination
                  v-model:current-page="dataPagination.page"
                  v-model:page-size="dataPagination.pageSize"
                  :page-sizes="[10, 20, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="dataPagination.total"
                  size="small"
                  @size-change="fetchDataList"
                  @current-change="fetchDataList"
                />
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>

      <!-- 字典类型对话框 -->
      <el-dialog
        v-model="typeDialogVisible"
        :title="typeDialogTitle"
        width="600px"
        @close="handleTypeDialogClose"
      >
        <el-form
          ref="typeFormRef"
          :model="typeFormData"
          :rules="typeRules"
          label-width="100px"
        >
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="typeFormData.name" placeholder="请输入字典名称" maxlength="50" />
          </el-form-item>
          <el-form-item label="字典编码" prop="code">
            <el-input
              v-model="typeFormData.code"
              placeholder="请输入字典编码，如：user_gender"
              maxlength="50"
              :disabled="!!typeFormData.id"
            />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="typeFormData.description"
              type="textarea"
              placeholder="请输入描述"
              :rows="3"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="typeFormData.sort" :min="0" :max="9999" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="typeFormData.status">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="typeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTypeSubmit" :loading="typeSubmitLoading">确定</el-button>
        </template>
      </el-dialog>

      <!-- 字典数据对话框 -->
      <el-dialog
        v-model="dataDialogVisible"
        :title="dataDialogTitle"
        width="600px"
        @close="handleDataDialogClose"
      >
        <el-form
          ref="dataFormRef"
          :model="dataFormData"
          :rules="dataRules"
          label-width="100px"
        >
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="dataFormData.label" placeholder="请输入字典标签（显示值）" maxlength="50" />
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="dataFormData.value" placeholder="请输入字典值（实际值）" maxlength="50" />
          </el-form-item>
          <el-form-item label="样式类名" prop="cssClass">
            <el-input v-model="dataFormData.cssClass" placeholder="请输入样式类名，如：primary、success" maxlength="50" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="dataFormData.sort" :min="0" :max="9999" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="dataFormData.remark"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dataFormData.status">
              <el-radio :value="1">启用</el-radio>
              <el-radio :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dataDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDataSubmit" :loading="dataSubmitLoading">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>

  <script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Edit, Delete } from '@element-plus/icons-vue'
  import {
    getDictTypeList,
    createDictType,
    updateDictType,
    deleteDictType,
    updateDictTypeStatus,
    getDictDataList,
    createDictData,
    updateDictData,
    deleteDictData,
    updateDictDataStatus,
  } from '../../api/dict'

  // ==================== 字典类型相关 ====================
  const typeLoading = ref(false)
  const typeSubmitLoading = ref(false)
  const typeDialogVisible = ref(false)
  const typeDialogTitle = ref('新增字典类型')
  const typeFormRef = ref(null)
  const typeTableRef = ref(null)
  const typeTableData = ref([])
  const currentType = ref(null)
  const syncingTypeSelection = ref(false)

  const typePagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const typeFormData = reactive({
    id: null,
    name: '',
    code: '',
    description: '',
    sort: 0,
    status: 1
  })

  const typeRules = {
    name: [
      { required: true, message: '请输入字典名称', trigger: 'blur' },
      { max: 50, message: '字典名称不能超过50个字符', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入字典编码', trigger: 'blur' },
      { max: 50, message: '字典编码不能超过50个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字典编码只能包含字母、数字和下划线，且不能以数字开头', trigger: 'blur' }
    ],
    description: [
      { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
    ]
  }

  const syncTypeSelection = async (row) => {
    syncingTypeSelection.value = true
    await nextTick()
    typeTableRef.value?.setCurrentRow(row || null)
    await nextTick()
    syncingTypeSelection.value = false
  }

  const syncDataSelection = async (row) => {
    syncingDataSelection.value = true
    await nextTick()
    dataTableRef.value?.setCurrentRow(row || null)
    await nextTick()
    syncingDataSelection.value = false
  }

  const applyCurrentType = async (row, { resetDataPage = true } = {}) => {
    currentType.value = row
    currentData.value = null

    if (!row) {
      dataTableData.value = []
      dataPagination.total = 0
      await syncTypeSelection(null)
      await syncDataSelection(null)
      return
    }

    if (resetDataPage) {
      dataPagination.page = 1
    }

    await syncTypeSelection(row)
    await fetchDataList()
  }

  // 获取字典类型列表
  const fetchTypeList = async () => {
    typeLoading.value = true
    try {
      const params = {
        page: typePagination.page,
        pageSize: typePagination.pageSize
      }
      const res = await getDictTypeList(params)
      typeTableData.value = res.data?.list || res.data || res.list || []
      typePagination.total = res.data?.total || res.total || typeTableData.value.length

      if (!typeTableData.value.length) {
        await applyCurrentType(null)
        return
      }

      const selectedType = currentType.value
        ? typeTableData.value.find(item => item.id === currentType.value.id) || typeTableData.value[0]
        : typeTableData.value[0]

      await applyCurrentType(selectedType, { resetDataPage: true })
    } catch (error) {
      ElMessage.error(error.message || '获取字典类型列表失败')
    } finally {
      typeLoading.value = false
    }
  }

  // 选择字典类型
  const handleTypeSelect = async (row) => {
    if (syncingTypeSelection.value) return

    await applyCurrentType(row)
  }

  // 新增字典类型
  const handleAddType = () => {
    typeDialogTitle.value = '新增字典类型'
    typeDialogVisible.value = true
  }

  // 编辑字典类型
  const handleEditType = (row) => {
    typeDialogTitle.value = '编辑字典类型'
    Object.assign(typeFormData, {
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      sort: row.sort,
      status: row.status
    })
    typeDialogVisible.value = true
  }

  // 删除字典类型
  const handleDeleteType = async (row) => {
    try {
      await ElMessageBox.confirm('删除字典类型会同时删除该类型下的所有字典数据，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await deleteDictType(row.id)
      ElMessage.success('删除成功')
      if (currentType.value?.id === row.id) {
        currentType.value = null
        currentData.value = null
        dataTableData.value = []
        dataPagination.total = 0
      }
      fetchTypeList()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  const buildDictTypePayload = () => ({
    name: typeFormData.name,
    code: typeFormData.code,
    description: typeFormData.description,
    sort: typeFormData.sort,
    status: typeFormData.status
  })

  // 提交字典类型
  const handleTypeSubmit = async () => {
    if (!typeFormRef.value) return

    await typeFormRef.value.validate(async (valid) => {
      if (valid) {
        typeSubmitLoading.value = true
        try {
          const payload = buildDictTypePayload()

          if (typeFormData.id) {
            await updateDictType(typeFormData.id, payload)
            ElMessage.success('更新成功')
          } else {
            await createDictType(payload)
            ElMessage.success('创建成功')
          }
          typeDialogVisible.value = false
          fetchTypeList()
        } catch (error) {
          ElMessage.error(error.message || '操作失败')
        } finally {
          typeSubmitLoading.value = false
        }
      }
    })
  }

  // 关闭字典类型对话框
  const handleTypeDialogClose = () => {
    typeFormRef.value?.resetFields()
    Object.assign(typeFormData, {
      id: null,
      name: '',
      code: '',
      description: '',
      sort: 0,
      status: 1
    })
  }

  // ==================== 字典数据相关 ====================
  const dataLoading = ref(false)
  const dataSubmitLoading = ref(false)
  const dataDialogVisible = ref(false)
  const dataDialogTitle = ref('新增字典数据')
  const dataFormRef = ref(null)
  const dataTableRef = ref(null)
  const dataTableData = ref([])
  const currentData = ref(null)
  const syncingDataSelection = ref(false)

  const dataPagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const dataFormData = reactive({
    id: null,
    dictTypeId: null,
    label: '',
    value: '',
    cssClass: '',
    sort: 0,
    remark: '',
    status: 1
  })

  const dataRules = {
    label: [
      { required: true, message: '请输入字典标签', trigger: 'blur' },
      { max: 50, message: '字典标签不能超过50个字符', trigger: 'blur' }
    ],
    value: [
      { required: true, message: '请输入字典值', trigger: 'blur' },
      { max: 50, message: '字典值不能超过50个字符', trigger: 'blur' }
    ],
    cssClass: [
      { max: 50, message: '样式类名不能超过50个字符', trigger: 'blur' }
    ],
    remark: [
      { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
    ]
  }

  // 获取字典数据列表
  const fetchDataList = async () => {
    if (!currentType.value) {
      dataTableData.value = []
      dataPagination.total = 0
      currentData.value = null
      await syncDataSelection(null)
      return
    }
    dataLoading.value = true
    try {
      const params = {
        page: dataPagination.page,
        pageSize: dataPagination.pageSize
      }
      const res = await getDictDataList(currentType.value.id, params)
      dataTableData.value = res.data?.list || res.data || res.list || []
      dataPagination.total = res.data?.total || res.total || dataTableData.value.length

      if (!dataTableData.value.length) {
        currentData.value = null
        await syncDataSelection(null)
        return
      }

      const selectedData = currentData.value
        ? dataTableData.value.find(item => item.id === currentData.value.id) || dataTableData.value[0]
        : dataTableData.value[0]

      currentData.value = selectedData
      await syncDataSelection(selectedData)
    } catch (error) {
      ElMessage.error(error.message || '获取字典数据列表失败')
    } finally {
      dataLoading.value = false
    }
  }

  const handleDataSelect = (row) => {
    if (syncingDataSelection.value) return

    currentData.value = row || null
  }

  // 新增字典数据
  const handleAddData = () => {
    if (!currentType.value) {
      ElMessage.warning('请先选择字典类型')
      return
    }
    dataDialogTitle.value = '新增字典数据'
    dataFormData.dictTypeId = currentType.value.id
    dataDialogVisible.value = true
  }

  // 编辑字典数据
  const handleEditData = (row) => {
    dataDialogTitle.value = '编辑字典数据'
    Object.assign(dataFormData, {
      id: row.id,
      dictTypeId: row.dictTypeId,
      label: row.label,
      value: row.value,
      cssClass: row.cssClass,
      sort: row.sort,
      remark: row.remark,
      status: row.status
    })
    dataDialogVisible.value = true
  }

  // 删除字典数据
  const handleDeleteData = async (row) => {
    try {
      await ElMessageBox.confirm('确定要删除该字典数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await deleteDictData(row.id)
      ElMessage.success('删除成功')
      fetchDataList()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 字典数据状态切换
  const handleDataStatusChange = async (row) => {
    try {
      await updateDictDataStatus(row.id, row.status)
      ElMessage.success('状态更新成功')
    } catch (error) {
      ElMessage.error(error.message || '状态更新失败')
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  }

  const buildDictDataPayload = () => ({
    dictTypeId: dataFormData.dictTypeId,
    label: dataFormData.label,
    value: dataFormData.value,
    cssClass: dataFormData.cssClass,
    sort: dataFormData.sort,
    remark: dataFormData.remark,
    status: dataFormData.status
  })

  // 提交字典数据
  const handleDataSubmit = async () => {
    if (!dataFormRef.value) return

    await dataFormRef.value.validate(async (valid) => {
      if (valid) {
        dataSubmitLoading.value = true
        try {
          const payload = buildDictDataPayload()

          if (dataFormData.id) {
            await updateDictData(dataFormData.id, payload)
            ElMessage.success('更新成功')
          } else {
            await createDictData(payload)
            ElMessage.success('创建成功')
          }
          dataDialogVisible.value = false
          fetchDataList()
        } catch (error) {
          ElMessage.error(error.message || '操作失败')
        } finally {
          dataSubmitLoading.value = false
        }
      }
    })
  }

  // 关闭字典数据对话框
  const handleDataDialogClose = () => {
    dataFormRef.value?.resetFields()
    Object.assign(dataFormData, {
      id: null,
      dictTypeId: currentType.value?.id || null,
      label: '',
      value: '',
      cssClass: '',
      sort: 0,
      remark: '',
      status: 1
    })
  }

  onMounted(() => {
    fetchTypeList()
  })
  </script>

  <style scoped>
  .dict-management {
    padding: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .type-name {
    color: #409eff;
    font-size: 14px;
    margin-left: 5px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table__body tr.current-row > td) {
    background-color: #ecf5ff;
  }
  </style>
