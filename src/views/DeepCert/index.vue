<!-- eslint-disable -->
<template>
  <div class="app-container">
    <div class="warp">
      <div class="title">DeepCert 鲁棒半径计算工具</div>
      <div class="introduction">
        简介：DeepCert是一款用于快速计算给定神经网络鲁棒半径的工具。旨在快速、高效地解决鲁棒半径的计算问题。
        <br />
        开发者：华东师范大学 吴旖婷
      </div>

      <div style="text-align:center;padding:30px" >
        <transition name="el-zoom-in-center">
            <el-button round @click="show" v-show="!isDisplay">开始使用DeepCert！</el-button>
        </transition>
      </div>

      <transition name="el-fade-in">
      <div class="main" v-show="isDisplay">
        <el-form :model="ruleForm" ref="ruleFrom">
          <el-form-item prop="core" label="请选择是否启用Core">
            <el-radio v-model="ruleForm.core" label="True">True</el-radio>
            <el-radio v-model="ruleForm.core" label="False">False</el-radio>
          </el-form-item>
          <el-form-item
            prop="netName"
            label="请选择模型"
            v-if="ruleForm.core === 'False'"
          >
            <el-select v-model="ruleForm.netName" placeholder="请选择模型路径">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="netName"
            label="请选择模型"
            v-else-if="ruleForm.core === 'True'"
          >
            <el-select v-model="ruleForm.netName" placeholder="请选择模型路径">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="netName" label="请选择模型" v-else>
            <el-select v-model="ruleForm.netName" placeholder="请先选择core">
            </el-select>
          </el-form-item>
          <el-form-item prop="numOfImage" label="请选择图片数量">
            <el-input
              v-model="ruleForm.numOfImage"
              placeholder="请输入图片数量"
            ></el-input>
          </el-form-item>
          <el-form-item prop="norm" label="请选择范数">
            <el-radio v-model="ruleForm.norm" label="1">1</el-radio>
            <el-radio v-model="ruleForm.norm" label="2">2</el-radio>
            <el-radio v-model="ruleForm.norm" label="i">i</el-radio>
          </el-form-item>
          <el-form-item prop="activation" label="请选择activation">
            <el-radio v-model="ruleForm.activation" label="sigmoid">sigmoid</el-radio>
            <el-radio v-model="ruleForm.activation" label="tanh">tanh</el-radio>
            <el-radio v-model="ruleForm.activation" label="atan">atan</el-radio>
          </el-form-item>
          <el-form-item prop="isCifar" label="请选择是否启用cifar">
            <el-radio v-model="ruleForm.isCifar" label="True">True</el-radio>
            <el-radio v-model="ruleForm.isCifar" label="False">False</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="verify">开始计算鲁棒半径</el-button>
        </span>
      </div>
      </transition>
    </div>

    <el-dialog :visible.sync="waitingVisible" width="400px" center>
        <div v-loading="loading" element-loading-text="拼命计算中" style="height:100px"></div>
        <div style="height:65px;text-align:center;padding:20px">正在计算，请耐心等待</div>
        <div style="text-align:center">
            <el-button @click="back">后台运行</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { get, post } from "./indexByQzt";
export default {
  data() {
    return {
      isDisplay:false,
      loading:false,
      waitingVisible:false,
      ruleForm: {
        verifyId: "",
        netName: "",
        numOfImage: "",
        norm: "",
        core: "",
        activation: "",
        isCifar: "",
        isTinyImageNet: "False",
      },
      options1: [
        {
          value: "models/mnist_cnn_7layer_atan",
        },
        {
          value: "models/mnist_cnn_7layer_tanh",
        },
        {
          value: "models/mnist_cnn_7layer_sigmoid",
        },
        {
          value: "models/mnist_cnn_lenet_atan",
        },
        {
          value: "models/mnist_cnn_lenet_tanh",
        },
        {
          value: "models/mnist_cnn_lenet_sigmoid",
        },
        {
          value: "models/mnist_resnet_3_atan",
        },
        {
          value: "models/mnist_resnet_3_tanh",
        },
        {
          value: "models/mnist_resnet_3_sigmoid",
        },
        {
          value: "models/mnist_resnet_4_atan",
        },
        {
          value: "models/mnist_resnet_4_tanh",
        },
        {
          value: "models/mnist_resnet_4_sigmoid",
        },
        {
          value: "models/mnist_resnet_5_atan",
        },
        {
          value: "models/mnist_resnet_5_tanh",
        },
        {
          value: "models/mnist_resnet_5_sigmoid ",
        },
        {
          value: "models/cifar_cnn_7layer_atan",
        },
        {
          value: "models/cifar_cnn_7layer_tanh",
        },
        {
          value: "models/cifar_cnn_7layer_sigmoid",
        },
      ],
      options2: [
        {
          value: "models/mnist_cnn_4layer_5_3_atan",
        },
        {
          value: "models/mnist_cnn_4layer_5_3_tanh",
        },
        {
          value: "models/mnist_cnn_4layer_5_3_sigmoid",
        },
        {
          value: "models/mnist_cnn_8layer_5_3_atan",
        },
        {
          value: "models/mnist_cnn_8layer_5_3_tanh",
        },
        {
          value: "models/mnist_cnn_8layer_5_3_sigmoid",
        },
        {
          value: "models/cifar_cnn_7layer_5_3_atan",
        },
        {
          value: "models/cifar_cnn_7layer_5_3_tanh",
        },
        {
          value: "models/cifar_cnn_7layer_5_3_sigmoid",
        },
      ],
      data: {
        imageUrl: "",
      },
    };
  },
  methods: {
    show(){
        this.isDisplay = true;
    },
    notify(title, type) {
      this.$notify({
        title: title,
        type: type,
      });
    },
    verify() {
      const getVerifyId = (params) => get(`/verify/verify_id`);
      getVerifyId().then((res) => {
        if (res.status == 200) {
          this.ruleForm.verifyId = res.data.verifyId;
          this.notify("获取verifyId成功", "success");
        } else {
          this.notify("获取verifyId失败", "error");
        }
      });
      let params = new URLSearchParams();
      params.append("verifyId", this.ruleForm.verifyId);
      params.append("netName", this.ruleForm.netName);
      params.append("numOfImage", this.ruleForm.numOfImage);
      params.append("norm", this.ruleForm.norm);
      params.append("core", this.ruleForm.core);
      params.append("activation", this.ruleForm.activation);
      params.append("isCifar", this.ruleForm.isCifar);
      params.append("isTinyImageNet", this.ruleForm.isTinyImageNet);
      const verifyDeepCert = (params) =>
        post(`/verify/deepcert/${this.$store.getters.userId}`, params);
      verifyDeepCert(params)
        .then((res) => {
          if (res.status == 200) {
            this.notify("验证成功", "success");
            this.loading = true;
            this.waitingVisible = true;
          } else if(res.status == -400){
            this.notify("参数有误", "error");
          }
          else if(res.status == -100){
            this.notify("websocket未建立", "error");S
          }
          else{
            this.notify("未知错误", "error");
          }
        })
    },
    back(){
        this.loading = false;
        this.waitingVisible = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.warp {
  width: 80%;
  margin: 0 atuo;
  overflow: visible;
}
.introduction {
  font-family: "微软雅黑";
  font-size: 15px;
  line-height: 50px;
  text-align: center;
  border: solid 1px blue;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transform-origin: 0 0;
}
.title {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: "微软雅黑";
  padding: 30px;
  width: 100%;
}
</style>
