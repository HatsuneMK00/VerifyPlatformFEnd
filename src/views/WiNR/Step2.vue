<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="1" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <h4>正在验证……</h4>
    <div align="center">
      <el-button type="primary" round @click="dialogVisible = true">后台运行</el-button>
      <el-dialog
        title="提示"
        v-model="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>将跳回工具首页。验证结果可在历史记录中查看。</span>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false;jump_to_index">确定</el-button>
    </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step2',
  methods: {
    jump_to_index() {
      this.$router.replace({ path: '/WiNR/index' })
    }
  }
}
</script>

<style scoped>

</style>
