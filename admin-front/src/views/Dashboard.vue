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

    <el-row :gutter="20" class="upload-row">
      <el-col :xs="24" :xl="12">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>图片上传与预览</span>
              <el-tag type="success">单张 5MB 内</el-tag>
            </div>
          </template>

          <p class="upload-tip">
            支持 `jpg / jpeg / png / gif / webp / svg`，选择后自动上传，点击缩略图可放大预览。
          </p>

          <el-upload
            v-model:file-list="imageFileList"
            list-type="picture-card"
            accept="image/*"
            multiple
            :limit="10"
            :http-request="handleImageUploadRequest"
            :before-upload="beforeImageUpload"
            :before-remove="handleImageBeforeRemove"
            :on-change="handleImageChange"
            :on-success="handleImageUploadSuccess"
            :on-preview="handleImagePreview"
            :on-remove="handleImageRemoved"
            :on-exceed="handleImageExceed"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <div v-if="uploadedImages.length" class="upload-result-list">
            <div class="section-title">已上传图片</div>
            <div class="image-grid">
              <button
                v-for="item in uploadedImages"
                :key="item.id"
                type="button"
                class="image-card"
                @click="openUploadedImage(item)"
              >
                <img :src="buildImagePreviewUrl(item.id)" :alt="item.name" class="image-card__thumb" />
                <div class="image-card__meta">
                  <span class="image-card__name">{{ item.name }}</span>
                  <span class="image-card__tag">ID {{ item.id }}</span>
                </div>
                <el-button
                  class="image-card__delete"
                  type="danger"
                  size="small"
                  text
                  :icon="Delete"
                  @click.stop="handleDeleteImage(item)"
                >
                  删除
                </el-button>
              </button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="12">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>文件上传与预览</span>
              <el-tag type="warning">单个 100MB 内</el-tag>
            </div>
          </template>

          <p class="upload-tip">
            支持批量上传文件，上传后可在线预览图片、PDF、文本类文件，也可以直接下载。
          </p>

          <el-upload
            v-model:file-list="documentFileList"
            drag
            multiple
            :limit="10"
            :show-file-list="false"
            :http-request="handleFileUploadRequest"
            :before-upload="beforeFileUpload"
            :on-success="handleFileUploadSuccess"
            :on-exceed="handleFileExceed"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">拖拽文件到这里，或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">推荐用于资料、文档、文本、PDF 等文件的上传与预览。</div>
            </template>
          </el-upload>

          <div v-if="uploadedFiles.length" class="upload-result-list">
            <div class="section-title">已上传文件</div>
            <el-table :data="uploadedFiles" size="small" border class="file-table">
              <el-table-column prop="name" label="文件名" min-width="220" show-overflow-tooltip />
              <el-table-column label="大小" width="110">
                <template #default="{ row }">
                  {{ formatFileSize(row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="mimeType" label="类型" min-width="180" show-overflow-tooltip />
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" :icon="View" @click="handlePreviewFile(row)">预览</el-button>
                  <el-button link type="primary" :icon="Download" @click="handleDownloadFile(row)">下载</el-button>
                  <el-button link type="danger" :icon="Delete" @click="handleDeleteFile(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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

    <el-dialog v-model="imagePreviewVisible" title="图片预览" width="720px">
      <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="图片预览" class="preview-image" />
    </el-dialog>

    <el-dialog
      v-model="filePreviewVisible"
      :title="previewFileTitle"
      width="70%"
      top="5vh"
      @closed="cleanupPreviewFileUrl"
    >
      <div v-loading="filePreviewLoading" class="file-preview-body">
        <img
          v-if="filePreviewMode === 'image' && previewFileUrl"
          :src="previewFileUrl"
          :alt="previewFileTitle"
          class="preview-image"
        />

        <iframe
          v-else-if="filePreviewMode === 'pdf' && previewFileUrl"
          :src="previewFileUrl"
          class="preview-frame"
          title="文件预览"
        />

        <pre v-else-if="filePreviewMode === 'text'" class="preview-text">{{ previewTextContent }}</pre>

        <el-empty v-else description="当前文件暂不支持在线预览，请直接下载查看。" />
      </div>

      <template #footer>
        <el-button @click="filePreviewVisible = false">关闭</el-button>
        <el-button v-if="currentPreviewFile" type="primary" @click="handleDownloadFile(currentPreviewFile)">
          下载文件
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Document,
  ChatDotRound,
  View,
  Plus,
  Edit,
  Setting,
  UploadFilled,
  Download,
  Delete
} from '@element-plus/icons-vue'
import { uploadImages, uploadFiles, downloadFileBlob, deleteUploadedFile } from '../api/upload'
import { buildApiUrl } from '../utils/api-base-url'

const runningTime = ref('0天0小时0分钟')
const imageFileList = ref([])
const documentFileList = ref([])
const uploadedImages = ref([])
const uploadedFiles = ref([])
const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
const filePreviewVisible = ref(false)
const filePreviewLoading = ref(false)
const filePreviewMode = ref('unsupported')
const previewFileUrl = ref('')
const previewTextContent = ref('')
const previewFileTitle = ref('文件预览')
const currentPreviewFile = ref(null)

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

const textPreviewExtensions = new Set([
  'txt',
  'md',
  'json',
  'js',
  'ts',
  'jsx',
  'tsx',
  'css',
  'scss',
  'less',
  'html',
  'xml',
  'csv',
  'yml',
  'yaml',
  'log'
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

const normalizeResponseArray = (res) => {
  const payload = res?.data ?? res
  return Array.isArray(payload) ? payload : []
}

const buildImagePreviewUrl = (id) => buildApiUrl(`/upload/image/${id}?download=false`)

const formatFileSize = (size = 0) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const getFileExtension = (name = '') => {
  const segments = name.split('.')
  return segments.length > 1 ? segments.pop().toLowerCase() : ''
}

const isTextPreviewable = (file) => {
  const mimeType = file?.mimeType || ''
  const extension = getFileExtension(file?.name)

  return (
    mimeType.startsWith('text/') ||
    mimeType.includes('json') ||
    mimeType.includes('javascript') ||
    mimeType.includes('xml') ||
    mimeType.includes('csv') ||
    textPreviewExtensions.has(extension)
  )
}

const revokeObjectUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

const releaseLocalPreview = (file) => {
  if (file?.localPreviewUrl) {
    revokeObjectUrl(file.localPreviewUrl)
    file.localPreviewUrl = ''
  }
}

const cleanupPreviewFileUrl = () => {
  revokeObjectUrl(previewFileUrl.value)
  previewFileUrl.value = ''
  previewTextContent.value = ''
  filePreviewMode.value = 'unsupported'
  filePreviewLoading.value = false
  currentPreviewFile.value = null
}

const upsertUploadedRecord = (listRef, item) => {
  const nextList = listRef.value.filter(record => record.id !== item.id)
  nextList.unshift(item)
  listRef.value = nextList
}

const removeUploadedRecord = (listRef, id) => {
  listRef.value = listRef.value.filter(item => item.id !== id)
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isValidSize = file.size / 1024 / 1024 <= 5

  if (!isImage) {
    ElMessage.warning('只能上传图片文件')
    return false
  }

  if (!isValidSize) {
    ElMessage.warning('图片大小不能超过 5MB')
    return false
  }

  return true
}

const beforeFileUpload = (file) => {
  const isValidSize = file.size / 1024 / 1024 <= 100

  if (!isValidSize) {
    ElMessage.warning('文件大小不能超过 100MB')
    return false
  }

  return true
}

const handleImageExceed = () => {
  ElMessage.warning('最多只能上传 10 张图片')
}

const handleFileExceed = () => {
  ElMessage.warning('最多只能上传 10 个文件')
}

const handleImageChange = (uploadFile, uploadFiles) => {
  if (uploadFile.raw && !uploadFile.url) {
    const localUrl = URL.createObjectURL(uploadFile.raw)
    uploadFile.url = localUrl
    uploadFile.localPreviewUrl = localUrl
  }

  imageFileList.value = uploadFiles
}

const handleImageUploadRequest = async (options) => {
  try {
    const formData = new FormData()
    formData.append('files', options.file)

    const res = await uploadImages(formData)
    const [uploaded] = normalizeResponseArray(res)

    if (!uploaded) {
      throw new Error('图片上传失败')
    }

    options.onSuccess(uploaded)
  } catch (error) {
    options.onError(error)
  }
}

const handleFileUploadRequest = async (options) => {
  try {
    const formData = new FormData()
    formData.append('files', options.file)

    const res = await uploadFiles(formData)
    const [uploaded] = normalizeResponseArray(res)

    if (!uploaded) {
      throw new Error('文件上传失败')
    }

    options.onSuccess(uploaded)
  } catch (error) {
    options.onError(error)
  }
}

const handleImageUploadSuccess = (response, uploadFile, uploadFiles) => {
  const image = response?.id ? response : null

  if (!image) {
    return
  }

  releaseLocalPreview(uploadFile)
  uploadFile.serverId = image.id
  uploadFile.name = image.name
  uploadFile.url = buildImagePreviewUrl(image.id)
  imageFileList.value = uploadFiles

  upsertUploadedRecord(uploadedImages, image)
  ElMessage.success(`图片 ${image.name} 上传成功`)
}

const handleFileUploadSuccess = (response, uploadFile, uploadFiles) => {
  const file = response?.id ? response : null

  if (!file) {
    return
  }

  uploadFile.serverId = file.id
  uploadFile.name = file.name
  documentFileList.value = uploadFiles

  upsertUploadedRecord(uploadedFiles, file)
  ElMessage.success(`文件 ${file.name} 上传成功`)
}

const handleImagePreview = (file) => {
  imagePreviewUrl.value = file.url || buildImagePreviewUrl(file.serverId)
  imagePreviewVisible.value = true
}

const openUploadedImage = (image) => {
  imagePreviewUrl.value = buildImagePreviewUrl(image.id)
  imagePreviewVisible.value = true
}

const findUploadFileByServerId = (serverId) => {
  return imageFileList.value.find((item) => item.serverId === serverId)
}

const syncImageUploadListAfterDelete = (serverId) => {
  const matchedFile = findUploadFileByServerId(serverId)

  if (matchedFile) {
    releaseLocalPreview(matchedFile)
  }

  imageFileList.value = imageFileList.value.filter((item) => item.serverId !== serverId)
}

const syncDocumentUploadListAfterDelete = (serverId) => {
  documentFileList.value = documentFileList.value.filter((item) => item.serverId !== serverId)
}

const removeUploadedResource = (file) => {
  if (!file?.id) {
    return
  }

  removeUploadedRecord(uploadedFiles, file.id)
  removeUploadedRecord(uploadedImages, file.id)
}

const deleteUploadedResource = async (file, successMessage) => {
  await deleteUploadedFile(file.id)
  removeUploadedResource(file)
  syncImageUploadListAfterDelete(file.id)
  syncDocumentUploadListAfterDelete(file.id)

  if (currentPreviewFile.value?.id === file.id) {
    filePreviewVisible.value = false
    cleanupPreviewFileUrl()
  }

  if (imagePreviewVisible.value && imagePreviewUrl.value === buildImagePreviewUrl(file.id)) {
    imagePreviewVisible.value = false
    imagePreviewUrl.value = ''
  }

  ElMessage.success(successMessage)
}

const handleImageBeforeRemove = async (file) => {
  if (!file.serverId) {
    releaseLocalPreview(file)
    return true
  }

  try {
    await ElMessageBox.confirm(`确定要删除图片“${file.name}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteUploadedResource(
      { id: file.serverId, name: file.name },
      `图片 ${file.name} 已删除`
    )
    return true
  } catch (error) {
    return false
  }
}

const handleImageRemoved = (file) => {
  releaseLocalPreview(file)
}

const readTextPreview = async (blob) => {
  const maxPreviewSize = 1024 * 1024
  const text = await blob.slice(0, maxPreviewSize).text()

  if (blob.size > maxPreviewSize) {
    return `${text}\n\n------\n仅展示前 1MB 内容，完整文件请下载查看。`
  }

  return text
}

const handlePreviewFile = async (file) => {
  cleanupPreviewFileUrl()
  filePreviewVisible.value = true
  filePreviewLoading.value = true
  previewFileTitle.value = file.name
  currentPreviewFile.value = file

  try {
    const blob = await downloadFileBlob(file.id)
    const objectUrl = URL.createObjectURL(blob)

    if ((blob.type || file.mimeType || '').startsWith('image/')) {
      filePreviewMode.value = 'image'
      previewFileUrl.value = objectUrl
      return
    }

    if ((blob.type || file.mimeType || '').includes('pdf') || getFileExtension(file.name) === 'pdf') {
      filePreviewMode.value = 'pdf'
      previewFileUrl.value = objectUrl
      return
    }

    revokeObjectUrl(objectUrl)

    if (isTextPreviewable(file)) {
      filePreviewMode.value = 'text'
      previewTextContent.value = await readTextPreview(blob)
      return
    }

    filePreviewMode.value = 'unsupported'
  } catch (error) {
    filePreviewVisible.value = false
  } finally {
    filePreviewLoading.value = false
  }
}

const handleDownloadFile = async (file) => {
  try {
    const blob = await downloadFileBlob(file.id)
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.name || `file-${file.id}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    revokeObjectUrl(downloadUrl)
  } catch (error) {
    // 错误提示由请求拦截器统一处理
  }
}

const handleDeleteImage = async (image) => {
  try {
    await ElMessageBox.confirm(`确定要删除图片“${image.name}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteUploadedResource(image, `图片 ${image.name} 已删除`)
  } catch (error) {
    if (error !== 'cancel') {
      // 错误提示由请求拦截器统一处理
    }
  }
}

const handleDeleteFile = async (file) => {
  try {
    await ElMessageBox.confirm(`确定要删除文件“${file.name}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteUploadedResource(file, `文件 ${file.name} 已删除`)
  } catch (error) {
    if (error !== 'cancel') {
      // 错误提示由请求拦截器统一处理
    }
  }
}

onMounted(() => {
  updateRunningTime()
  timer = setInterval(updateRunningTime, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }

  imageFileList.value.forEach(releaseLocalPreview)
  cleanupPreviewFileUrl()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row,
.content-row,
.upload-row {
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.upload-card {
  height: 100%;
}

.upload-tip {
  margin: 0 0 16px;
  color: #606266;
  line-height: 1.7;
  font-size: 13px;
}

.upload-result-list {
  margin-top: 18px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.image-card {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 8px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.image-card:hover {
  border-color: #409eff;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

.image-card__thumb {
  display: block;
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f7fa;
}

.image-card__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.image-card__name {
  font-size: 13px;
  color: #303133;
  word-break: break-all;
}

.image-card__tag {
  font-size: 12px;
  color: #909399;
}

.image-card__delete {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
}

.file-table {
  width: 100%;
}

.file-preview-body {
  min-height: 320px;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: 70vh;
  margin: 0 auto;
  border-radius: 8px;
}

.preview-frame {
  width: 100%;
  height: 70vh;
  border: none;
  border-radius: 8px;
  background: #f5f7fa;
}

.preview-text {
  margin: 0;
  padding: 16px;
  max-height: 70vh;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 10px;
  line-height: 1.65;
  font-size: 13px;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 13px;
}

@media (max-width: 768px) {
  .quick-actions {
    flex-direction: column;
  }

  .info-item {
    flex-direction: column;
    gap: 6px;
  }

  .image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
