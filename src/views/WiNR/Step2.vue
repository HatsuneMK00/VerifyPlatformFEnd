<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="1" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <h4></h4>
    <template>
      <el-table
        v-loading="loading"
        element-loading-text="正在验证，请稍后……"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,252,153,0.5)"
        element-loading-
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label=" "
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label=" "
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label=" "
        >
        </el-table-column>
      </el-table>
    </template>
    <div align="center">
      <h4></h4>
      <h5>可选择后台运行。验证结果可在验证历史记录中查看。</h5>
      <el-button type="primary" round @click="run_back">后台运行</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step2',
  methods: {
    run_back() {
      this.$confirm('将跳回工具首页。验证结果可在历史记录中查看。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.replace({ path: '/WiNR/index' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  data() {
    return {
      tableData: [{
        date: ' ',
        name: ' ',
        address: ' '
      }, {
        date: ' ',
        name: ' ',
        address: ' '
      }, {
        date: ' ',
        name: ' ',
        address: ' '
      }],
      loading: true
    }
  }
}
</script>

<style scoped>

</style>
