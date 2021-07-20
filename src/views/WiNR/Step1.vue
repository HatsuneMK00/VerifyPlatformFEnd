<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="0" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <el-form ref="ParaPack" :model="ParaPacket" class="register-container" label-width="200px">
      <el-form-item label="网络模型：">
        <!--        <el-input type="text" v-model="ParaPack.para1" clearable></el-input>-->
        <el-select v-model="ParaPacket.model" placeholder="请选择网络模型">
          <el-option
            label="cifar10_cnn_lenet_averpool_sigmoid_myself"
            value="cifar10_cnn_lenet_averpool_sigmoid_myself"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_4layer_5_3_sigmoid_myself"
            value="fashion_mnist_cnn_4layer_5_3_sigmoid_myself"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_6layer_5_3_sigmoid_myself"
            value="fashion_mnist_cnn_6layer_5_3_sigmoid_myself"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_8layer_5_3_sigmoid_myself"
            value="fashion_mnist_cnn_8layer_5_3_sigmoid_myself"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_10layer_5_3_sigmoid_myself"
            value="fashion_mnist_cnn_10layer_5_3_sigmoid_myself"
          ></el-option>
          <el-option
            label="gtsrb_cnn_5layer_sigmoid_myself"
            value="gtsrb_cnn_5layer_sigmoid_myself"
          ></el-option>
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
          <el-option label="cifar10" value="cifar10"></el-option>
          <el-option label="fashion_mnist" value="fashion_mnist"></el-option>
          <el-option label="gtsrb" value="gtsrb"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片数量：">
        <el-col :span="6">
          <el-input type="text" v-model="ParaPacket.imageNum" clearable></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button type="primary" round @click="submit_para">下一步</el-button>
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
      },
      Flag: {
        isSubmitSuccess: 'f'
      }
    }
  },
  methods: {
    async submit_para() {
      // get verify_id and put into ParaPacket
      this.$axios
        .get('/verify/verify_id')
        .then((res) => {
          this.ParaPacket.verifyId = res.data.data.verifyId
          // console.log(res)
          // console.log(this.ParaPacket)
        })
        .catch(function(error) {
          console.log(error)
        })
      // post parameter, problem: websocket unrealized
      this.$axios
        .post('/verify/winr/' + this.$store.getters.userId, this.ParaPacket)
        .then((res) => {
          console.log(res)
          if (res.data.status === 200) {
            this.Flag.isSubmitSuccess = 't'
            this.$alert('验证提交成功。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          } else if (res.data.status === -100) {
            this.$alert('验证提交失败！Websocket未建立。将返回工具首页。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          } else if (res.data.status === -400) {
            this.$alert('验证提交失败！参数错误。将返回工具首页。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          } else {
            this.$alert('验证提交失败！未知原因。将返回工具首页。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      // jump to next page
      if (this.Flag.isSubmitSuccess === 't'){
        this.next_step()
      } else {
        this.to_index()
      }
    },
    next_step() {
      this.$router.replace({ path: '/WiNR/step2' })
    },
    to_index() {
      this.$router.replace({ path: '/WiNR/index' })
    }
  }
}
</script>

<style scoped>

</style>
