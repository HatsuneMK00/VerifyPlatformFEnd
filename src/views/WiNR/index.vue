<template>
  <div class="app-container">
    <div class="title1">WiNR</div>
    <div class="bg">
      <div class="title2">
        简介
      </div>
      <div class="introduction">
        WiNR是第一个健壮性验证工具，该工具可以采用非ReLU激活函数的各种神经网络架构生成对抗性示例。此外也是第一个将误报作为健壮性验证评估标准之一的工具。
      </div>
    </div>
    <div class="title2">
      创新
    </div>
    <div align="center">
      <img class="winr_merits" style="height: 300px; width: 300px;" src="../../assets/WiNR_pic/WiNR_merits.png">
    </div>
    <div class="creativity-introduction">
      1. 方法新。提出了一种在采用非ReLU的神经网络鲁棒性验证中生成对抗性示例的方法。
      <br>
      2. 速度快。使用紧密近似和约束替换技术来加速对抗性示例生成。
      <br>
      3. 效果好。误报少，假阳性率低。
      <br>
      4. 支持广。支持广泛的非ReLU神经网络架构，包括CNN、LeNet和ResNet；支持在各种数据集上进行训练，包括MNIST、CIFAR10等。
    </div>
    <div class="bg">
      <div class="title2">
        效果
      </div>
      <div class="introduction">
        实验结果表明，WiNR能够有效地验证平均在一分钟内输入超过10000个神经元的中型神经网络；且假阳性率较低，平均只有6.28%。
      </div>
    </div>
    <div class="title2">
      验证过程
    </div>
    <div align="center">
      <img class="winr_flowchart" alt style="height: 463px; width: 433px;"
           src="../../assets/flow_chart/WiNR_FlowChart210815.png"
      >
    </div>
    <div class="title2">使用步骤</div>
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
  font-size: 24px;
  font-family: "微软雅黑";
  padding: 8px;
  width: 100%;
}

.title2 {
  position: relative;
  text-align: center;
  font-size: 20px;
  font-family: "微软雅黑 Light";
  padding: 5px;
  width: 100%;
}

.introduction {
  font-family: "Times New Roman", "华文细黑";
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  margin: 30px 60px;
  margin-top: 10px;
  margin-right: 150px;
  margin-bottom: 10px;
  margin-left: 150px;
}

.creativity-introduction {
  font-family: "Times New Roman", "华文细黑";
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  margin: 30px 60px;
  margin-top: 10px;
  margin-right: 150px;
  margin-bottom: 10px;
  margin-left: 150px;
}

.bg {
  background: rgba(90, 110, 240, 0.4);
}
</style>
