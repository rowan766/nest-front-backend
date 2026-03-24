<template>
  <div class="asset-placeholder">
    <section class="hero-panel">
      <p class="eyebrow">业务系统</p>
      <h1>{{ title }}</h1>
      <p class="description">
        {{ description }}
      </p>
    </section>

    <el-card class="placeholder-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>页面占位</span>
          <el-tag type="primary" effect="light">待接入业务功能</el-tag>
        </div>
      </template>

      <div class="placeholder-grid">
        <div class="placeholder-block">
          <span class="block-label">当前模块</span>
          <strong>{{ title }}</strong>
        </div>
        <div class="placeholder-block">
          <span class="block-label">页面状态</span>
          <strong>已创建占位页面</strong>
        </div>
        <div class="placeholder-block">
          <span class="block-label">后续可扩展</span>
          <strong>筛选、台账、详情、统计</strong>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.asset-placeholder {
  display: grid;
  gap: 20px;
}

.hero-panel {
  padding: 28px 32px;
  border-radius: 24px;
  color: #14324d;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.9), transparent 42%),
    linear-gradient(135deg, #dff3e8 0%, #eef7ff 52%, #f8fbff 100%);
  box-shadow: 0 16px 40px rgba(20, 50, 77, 0.08);
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #4d7f70;
}

.hero-panel h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.description {
  max-width: 620px;
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.8;
  color: #557089;
}

.placeholder-card {
  border: none;
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(18, 38, 63, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
}

.placeholder-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.placeholder-block {
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef5fb 100%);
  border: 1px solid rgba(109, 142, 174, 0.16);
}

.block-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  color: #7c93a7;
}

.placeholder-block strong {
  font-size: 16px;
  color: #20364b;
}
</style>
