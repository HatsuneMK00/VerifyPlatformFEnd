<template>
  <div class="app-container">
    <div class="title1">WiNR 工具</div>
    <div class="introduction">
      WiNR 是一款用于验证神经网络是否满足鲁棒性的工具。输入要验证的图片、网络模型和扰动值，WiNR可以返回相应的验证结果。如果网络不满足鲁棒性，工具会额外返回一张对抗样本。
      <br/>
      开发者：华东师范大学 张兆迪
    </div>
    <div class="title2">WiNR 工具使用步骤</div>
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

<style scoped>
.title1 {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: "微软雅黑";
  padding: 30px;
  width: 100%;
}
.title2 {
  position: relative;
  text-align: center;
  font-size: 24px;
  font-family: "微软雅黑";
  padding: 20px;
  width: 100%;
}

.introduction {
  font-family: "微软雅黑";
  font-size: 15px;
  line-height: 25px;
  text-align: center;
}

</style>
