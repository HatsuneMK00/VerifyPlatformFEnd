<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="0" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <el-form ref="ParaPack" :model="ParaPack" class="register-container" label-width="200px">
      <el-form-item label="网络模型：">
        <!--        <el-input type="text" v-model="ParaPack.para1" clearable></el-input>-->
        <el-select v-model="ParaPacket.model" placeholder="请选择网络模型">
          <el-option label="网络模型1" value="网络模型1"></el-option>
          <el-option label="网络模型2" value="网络模型2"></el-option>
          <el-option label="网络模型3" value="网络模型3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扰动值(Epsilon)：">
        <el-col :span="6">
          <el-input type="text" v-model="ParaPacket.epsilon" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="数据集：">
        <!--        <el-input type="text" v-model="ParaPack.dataset" clearable></el-input>-->
        <el-select v-model="ParaPacket.dataset" placeholder="请选择数据集">
          <el-option label="数据集1" value="数据集1"></el-option>
          <el-option label="数据集2" value="数据集2"></el-option>
          <el-option label="数据集3" value="数据集3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片数量：">
        <el-col :span="6">
          <el-input type="text" v-model="ParaPacket.imageNum" clearable></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button type="primary" round @click="submit_para;next_step">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { requestGet } from '../../utils/request'
export default {
  name: 'Step1',
  data() {
    return {
      ParaPacket: {
        verifyId: '',
        model: '',
        epsilon: '',
        dataset: '',
        imageNum: ''
      }
    }
  },
  methods: {
    submit_para() {
      // get verify_id
      requestGet('/winr/verify_id', null)
        .then((res) => {
          if (res.status === '200') {
            this.ParaPacket.verifyId = res.data.verifyId
            console.log('get vid: ' + this.ParaPacket.verifyId)
          } else {
            this.$message('失败！')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      // post parameter, not realized
    },
    next_step() {
      this.$router.replace({ path: '/WiNR/step2' })
    }
  }
}
</script>

<style scoped>

</style>
