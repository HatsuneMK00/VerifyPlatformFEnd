<!-- eslint-disable -->
<template>
  <div class="app-container" align="center">
    <div class="warp">
      <div class="title">DeepCert 鲁棒半径计算工具</div>
      <div class="introduction">
        DeepCert是之前基于线性近似的鲁棒性验证方法的延续，这项工作创新地提出了一种对一般激活函数的细粒度线性近似方法，用于计算卷积神经网络更大的鲁棒性下界。该方法计算复杂度较低，适用于使用较紧的上下界和下界来逼近类sigmoid函数。我们在最先进的鲁棒性下界认证工具CNN-Cert上实现了该方法。在具有不同激活函数的各种神经网络的情况下，我们在CNN-Cert的框架基础上实现了DeepCert验证工具。

        <br /><br />
        <div style="text-indent: 0.75cm">
          我们在MNIST和CIFAR-10上对训练好的含有不同结构的神经网络进行验证。实验结果表明，在同一网络的指定输入样本和指定分类下，我们的方法计算出的鲁棒半径比CNN-Cert提高了76.57%，比CROWN提高了286.28%，比FROWN提高了245.69%，且计算效率高而稳定。
        </div>
        <div>
          <el-button type="text">
            <a href="/pdf/Deepcert工具使用说明.pdf">使用说明文档</a>
          </el-button>
        </div>
      </div>

      <div style="text-align: center; padding: 30px">
        <transition name="el-zoom-in-center">
          <el-button round @click="show" v-show="!isDisplay" type="primary"
            >开始使用DeepCert！</el-button
          >
        </transition>
      </div>

      <transition name="el-fade-in">
        <div v-show="isDisplay">
          <el-form :model="ruleForm" ref="ruleFrom" label-width="200px">
            <el-form-item label="数据集：" align="left">
              <el-select v-model="dataset" placeholder="请选择数据集">
                <el-option v-for="item in datasetList" :key="item.name" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="上传模型文件:" align="left">
              <el-upload
                ref="upload2"
                name="modelFile"
                action="deepcert/model"
                :before-upload="beforeModelUpload"
                :http-request="httpRequest2"
              >
                <el-button type="primary">点击上传模型文件</el-button>
                <div slot="tip" class="el-upload__tip">
                    网络只支持 ‘卷积层+全连接层’ 或 ‘卷积层+池化层/残差层+全连接层’，暂时不支持全连接网络；
                    <br />
                    卷积层+全连接层文件名格式如下:‘模型文件名数据集_cnn_层数_filter数_kernel数_激活函数’；
                    <br />
                    卷积层+池化层/残差层+全连接层文件名格式如下：‘模型文件名数据集_cnn/resnet_网络层数/结构特征_激活函数’；
                    <br />
                    激活函数支持sigmoid,tanh和arctan
                </div>
              </el-upload>
            </el-form-item>

            <el-form-item label="上传图片：" align="left">
              <div v-if="dataset == ''">请先选择数据集</div>
              <div v-else-if="dataset == 'cifar'">
                <el-upload
                  ref="upload1"
                  multiple
                  name="images"
                  action=""
                  accept=".png"
                  :before-upload="beforeUp_Cifar"
                  :http-request="httpRequest1"
                  list-type="picture"
                >
                  <el-button type="primary">点击上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传png文件,且比例为32*32*3的彩色图
                  </div>
                </el-upload>
              </div>
              <div v-else>
                <el-upload
                  ref="upload1"
                  multiple
                  name="images"
                  action=""
                  accept=".png"
                  :before-upload="beforeUp_Mnist"
                  :http-request="httpRequest1"
                  list-type="picture"
                >
                  <el-button type="primary">点击上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传png文件,且比例为28*28的灰度图
                  </div>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="图片标签：" align="left">
              <div v-if="dataset === ''">请先选择数据集</div>
              <div v-else>
                <el-form>
                  <!-- eslint-disable -->
                  <el-form-item
                    v-for="picItem in picTable"
                    :label="picItem.name"
                  >
                    <el-select v-model="picItem.tag" placeholder="请选择标签">
                        <el-option
                          v-if="dataset === 'cifar'"
                          v-for="opt2 in cifarPicLabelOpt"
                          :value="opt2.value"
                          :label="opt2.label"
                        >
                        </el-option>
                        <el-option
                          v-else-if="dataset === 'mnist'"
                          v-for="opt1 in numberPicLabelOpt"
                          :label="opt1.label"
                          :value="opt1.value"
                        >
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </el-form-item>

            <el-form-item prop="norm" label="扰动半径度量标准" align="left">
              <el-radio v-model="ruleForm.norm" label="1">L1范数</el-radio>
              <el-radio v-model="ruleForm.norm" label="2">L2范数</el-radio>
              <el-radio v-model="ruleForm.norm" label="i">无穷范数</el-radio>
            </el-form-item>
          </el-form>

          <div style="text-align: center">
            <el-button type="primary" round @click="verify"
              >开始计算鲁棒半径</el-button
            >
          </div>
        </div>
      </transition>
    </div>

    <el-dialog :visible.sync="waitingVisible" width="400px" center>
      <div
        v-loading="loading"
        element-loading-text="拼命计算中"
        style="height: 100px"
      ></div>
      <div style="height: 65px; text-align: center; padding: 20px">
        正在计算，请耐心等待
      </div>
      <div style="text-align: center">
        <el-button @click="back">后台运行</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { get, post } from "./indexByQzt";
import labelOpt from "@/store/modules/labels.js";
import axios from "axios";
import {string} from "mockjs/src/mock/random/basic";
export default {
  data() {
    return {
      isDisplay: false,
      loading: false,
      waitingVisible: false,
      file: [],
      modelFile: "",
      initalName: "",
      imageName: [],
      info: "",
      infos: [],
      str: "{",
      picTable: [],
      dataset: "",
      datasetList: [],
      ruleForm: {
        verifyId: "",
        netName: "",
        norm: "",
        testImageInfoJson: "",
      },
      numberPicLabelOpt: labelOpt.numberPicLabelOpt,
      cifarPicLabelOpt: labelOpt.cifarPicLabelOpt
    };
  },
  methods: {
    show() {
      this.isDisplay = true;
      axios.get("https://datlab.zeabur.app/datasets")
        .then(res => {
          let list = res.data.results;
          this.datasetList = list.filter(item => String(item.name).startsWith("DeepCert"));
        })
        .catch(err => {
          this.datasetList = [
            {
              name: "DeepCert-cifar",
              value: "cifar"
            },
            {
              name: "DeepCert-mnist",
              value: "mnist"
            }
          ];
          console.log("Get dataset error" + err);
        });
    },
    notify(title, type) {
      this.$notify({
        title: title,
        type: type,
      });
    },
    beforeUp_Cifar(file) {
      const isSize = new Promise((resolve, reject) => {
        const width = 32;
        const height = 32;
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.onload = () => {
          console.log(img.width);
          console.log(img.height);
          const valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.notify("图片限制为32*32*3的彩色图,请重新上传", "error");
          return Promise.reject();
        }
      );
      return isSize;
    },
    beforeUp_Mnist(file) {
      const isSize = new Promise((resolve, reject) => {
        const width = 28;
        const height = 28;
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.onload = () => {
          console.log(img.width);
          console.log(img.height);
          const valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.notify("图片限制为28*28的灰度图,请重新上传", "error");
          return Promise.reject();
        }
      );
      return isSize;
    },
    httpRequest1(param) {
      let upData = new FormData();
      console.log(param.file);
      var img = document.createElement("img");
      img.src = param.file.name;
      console.log(img.width);
      upData.append("images", param.file);
      post("/deepcert/images", upData)
        .then((res) => {
          if (res.status == 200) {
            this.notify("图片上传成功", "success");
            //保留图片原始名称，选择tag时使用
            this.initalName = param.file.name;
            let initalTag;
            //根据图片名称初始化tag
            if (
              param.file.name.slice(15, 16) >= "0" &&
              param.file.name.slice(15, 16) <= "9"
            ) {
              initalTag = Number(param.file.name.slice(15, 16));
            }
            this.$set(this.picTable, this.picTable.length, {
              name: this.initalName,
              tag: initalTag,
            });
            //保存后端发来的图片名称
            for (let i = 0; i < res.data.imageNames.length; i++) {
              this.imageName.push(res.data.imageNames[i]);
            }
          } else {
            //后端传来错误信息时的差错控制
            this.notify("图片上传失败", "error");
          }
        })
        .catch((err) => {
          //网络问题的差错控制
          this.notify("图片上传失败,请检查网络", "error");
        });
    },
    beforeModelUpload(file){
      //检测模型文件名是否合法
      var patt1=new RegExp("([a-z]+_cnn_[0-9]+layer_[0-9]+_[0-9]+(_(sigmoid|tanh|arctan))?$)|([a-z]+_(cnn|resnet)_(([0-9]+)|([a-z]+))(_(sigmoid|tanh|arctan))?$)");
      if(patt1.test(file.name)==false){
        this.notify("文件名格式错误，请修改后再上传", "error");
        return false;
      }
    },
    httpRequest2(param) {
      this.modelFile = param.file;
      let upData = new FormData();
      upData.append("modelFile", this.modelFile);
      post("/deepcert/model", upData).then((res) => {
        if (res.status == 200) {
          this.ruleForm.netName = this.modelFile.name;
          this.notify("模型上传成功", "success");
        } else {
          this.notify("模型上传失败", "error");
        }
      });
    },
    verify() {
      const getVerifyId = (params) => get(`/verify/verify_id`);
      getVerifyId().then((res) => {
        if (res.status == 200) {
          this.ruleForm.verifyId = res.data.verifyId;
          this.notify("获取verifyId成功", "success");
          for (let j = 0; j < this.picTable.length; j++) {
            this.infos.push(this.picTable[j].tag);
            console.log("1");
          }
          for (let i = 0; i < this.infos.length; i++) {
            this.str =
              this.str + '"' + this.imageName[i] + '":"' + this.infos[i] + '"';
            if (i != this.infos.length - 1) this.str = this.str + ",";
          }
          this.str = this.str + "}";
          console.log(this.str);
          this.ruleForm.testImageInfoJson = this.str;
          let params = new URLSearchParams();
          params.append("verifyId", this.ruleForm.verifyId);
          params.append("netName", this.ruleForm.netName);
          params.append("norm", this.ruleForm.norm);
          params.append("testImageInfoJson", this.ruleForm.testImageInfoJson);
          const verifyDeepCert = (params) =>
            post(`/verify/deepcert/${this.$store.getters.userId}`, params);
          verifyDeepCert(params).then((res) => {
            if (res.status == 200) {
              this.notify("验证成功", "success");
              this.loading = true;
              this.waitingVisible = true;
            } else if (res.status == -400 || res.status == 430) {
              this.notify("参数有误", "error");
            } else if (res.status == -100) {
              this.notify("websocket未建立", "error");
            } else if (res.status == 410) {
              this.notify("没有获取到verifyId", "error");
            } else if (res.status == 420) {
              this.notify("无法传递参数", "error");
            } else if (res.status == 440) {
              this.notify("模型或图片不存在，请先上传", "error");
            } else {
              this.notify("未知错误", "error");
              console.log(res.status);
              console.log(this.ruleForm.testImageInfoJson);
            }
          });
          console.log("1");
        } else {
          this.notify("获取verifyId失败", "error");
        }
      });
    },
    back() {
      this.loading = false;
      this.waitingVisible = false;
    },
  },
  computed: {
    onWebSocketMessage() {
      console.log("sfdj");
      return this.$store.getters.message;
    },
  },
  watch: {
    onWebSocketMessage: function (msg) {
      console.log(msg);
      var succ = msg.slice(7, 11);
      console.log(succ);
      if (succ === "succ") {
        var verifyId = msg.split(":")[1];
        if (verifyId == null) {
          console.log("doesn't get verify id, exit");
          return;
        }
        this.$router.replace({
          path: "/DeepCert/show",
          query: { verifyId: verifyId },
        });
      } else {
        console.log("verify failed");
        this.back();
        this.$confirm("验证结果失败", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          this.$router.replace({ path: "/DeepCert/index" });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.warp {
  width: 80%;
  margin: 0 auto;
  overflow: visible;
}
.introduction {
  font-family: "微软雅黑";
  font-size: 15px;
  line-height: 35px;
  text-align: left;
  border: solid 1px blue;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transform-origin: 0 0;
  padding: 0.5cm 0.5cm 0.5cm 0.5cm;
  text-indent: 0.75cm;
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
