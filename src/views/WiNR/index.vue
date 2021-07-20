<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具介绍</h3>
    <h5>阿巴阿巴阿巴</h5>
    <h4 align="center">WiNR 工具使用步骤</h4>
    <el-steps :active="3" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <div align="center">
      <el-button type="primary" round @click="use_winr">开始使用WiNR</el-button>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    use_winr() {
      this.$router.replace({ path: '/WiNR/step1' })
    }
  }
}
</script>
