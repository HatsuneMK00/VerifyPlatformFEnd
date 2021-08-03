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

      <div style="text-align: center; padding: 30px">
        <transition name="el-zoom-in-center">
          <el-button round @click="show" v-show="!isDisplay"
            >开始使用DeepCert！</el-button
          >
        </transition>
      </div>

      <transition name="el-fade-in">
        <div class="main" v-show="isDisplay">
            <el-form
              :model="ruleForm"
              ref="ruleFrom"
              class="register-container"
            >

              <el-form-item label="上传模型文件:">
                <el-upload
                  ref="upload2"
                  name="modelFile"
                  action="deepcert/model"
                  :http-request="httpRequest2"
                >
                  <el-button size="small" type="primary"
                    >点击上传模型文件</el-button
                  >
                  <div slot="tip" class="el-upload__tip">
                    备注：目前只支持使用sigmoid激活函数的模型
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item label="上传图片：">
                <el-upload
                  ref="upload1"
                  multiple
                  name="images"
                  action=""
                  accept=".png, .jpg, .jpeg"
                  :http-request="httpRequest1"
                  list-type="picture"
                  class="pic-upload"
                >
                  <el-button type="primary">点击上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件
                  </div>
                </el-upload>
                <el-button @click="newForm" style="top: 10px"
                  >点击将以上图片上传至后台</el-button
                >
              </el-form-item>

              <el-form-item prop="norm" label="扰动半径度量标准">
                <el-radio v-model="ruleForm.norm" label="1">L1范数</el-radio>
                <el-radio v-model="ruleForm.norm" label="2">L2范数</el-radio>
                <el-radio v-model="ruleForm.norm" label="i">无穷范数</el-radio>
              </el-form-item>
            </el-form>

              <el-table :data="picTable" style="width: 100%">
                <el-table-column prop="name" label="图片名" width="180">
                </el-table-column>
                <el-table-column prop="tag" label="标签" width="180">
                </el-table-column>
              </el-table>

            <span slot="footer">
              <el-button @click="verify">开始计算鲁棒半径</el-button>
            </span>
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

    <el-dialog
      :visible.sync="isDisplayLog"
      width="400px"
      center
      :close-on-click-modal="false"
    >
      <div style="height: 65px; text-align: center; padding: 20px">
        请输入图片标签
      </div>
      <el-input v-model="info" placeholder="请输入图片标签"></el-input>
      <div style="text-align: center; position: relative; top: 20px">
        <el-button @click="uploadImageInfo">确定</el-button>
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
      isDisplay: false,
      isDisplayLog: false,
      loading: false,
      waitingVisible: false,
      file: [],
      modelFile: "",
      initalName:"",
      imageName: [],
      info: "",
      infos: [],
      str: "{",
      picTable: [],
      ruleForm: {
        verifyId: "",
        netName: "",
        norm: "",
        testImageInfoJson: "",
      },
    };
  },
  methods: {
    show() {
      this.isDisplay = true;
    },
    notify(title, type) {
      this.$notify({
        title: title,
        type: type,
      });
    },
    httpRequest1(param) {
      this.file.push(param.file);
      // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.initalName = param.file.name;   
      this.isDisplayLog = true;
    },
    newForm() {
      let upData = new FormData();
      // this.$refs.upload1.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
      this.file.forEach(function (file) {
        // 因为要上传多个文件，所以需要遍历
        upData.append("images", file);
      });
      post("/deepcert/images", upData).then((res) => {
        if (res.status == 200) {
          this.notify("图片上传成功", "success");
          for (let i = 0; i < res.data.imageNames.length; i++) {
            this.imageName.push(res.data.imageNames[i]);
          }
          console.log(this.imageName);
        } else {
          this.notify("图片上传失败", "error");
        }
      });
    },
    httpRequest2(param) {
      this.modelFile = param.file;
      let upData = new FormData();
      upData.append("modelFile", this.modelFile);
      // console.log(this.modelFile);
      this.ruleForm.netName = this.modelFile.name;
      post("/deepcert/model", upData).then((res) => {
        if (res.status == 200) {
          this.notify("模型上传成功", "success");
        } else {
          this.notify("模型上传失败", "error");
        }
      });
    },
    uploadImageInfo() {
      this.infos.push(this.info);
      this.$set(
        this.picTable, 
        this.picTable.length, {
        name: this.initalName,
        tag: this.info,
      });
      this.isDisplayLog = false;
    },
    verify() {
      const getVerifyId = (params) => get(`/verify/verify_id`);
      getVerifyId().then((res) => {
        if (res.status == 200) {
          this.ruleForm.verifyId = res.data.verifyId;
          this.notify("获取verifyId成功", "success");
          console.log(this.ruleForm.verifyId);
          for (let i = 0; i < this.infos.length; i++) {
            this.str =
              this.str + '"' + this.imageName[i] + '":"' + this.infos[i] + '"';
            if (i != this.infos.length - 1) this.str = this.str + ",";
          }
          this.str = this.str + "}";
          this.ruleForm.testImageInfoJson = this.str;
          let params = new URLSearchParams();
          params.append("verifyId", this.ruleForm.verifyId);
          params.append("netName", this.ruleForm.netName);
          console.log(this.ruleForm.netName);
          params.append("norm", this.ruleForm.norm);
          console.log(this.ruleForm.testImageInfoJson);
          params.append("testImageInfoJson", this.ruleForm.testImageInfoJson);
          const verifyDeepCert = (params) =>
            post(`/verify/deepcert/${this.$store.getters.userId}`, params);
          verifyDeepCert(params).then((res) => {
            if (res.status == 200) {
              this.notify("验证成功", "success");
              this.loading = true;
              this.waitingVisible = true;
            } else if (res.status == -400) {
              this.notify("参数有误", "error");
            } else if (res.status == -100) {
              this.notify("websocket未建立", "error");
            } else {
              this.notify("未知错误", "error");
            }
          });
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
      console.log('sfdj')
      return this.$store.getters.message
    }
  },
  watch: {
    onWebSocketMessage: function(msg) {
      console.log(msg)
      var succ = msg.slice(7, 11)
      console.log(succ)
      if (succ === 'succ') {
        var verifyId = msg.split(':')[1]
        if (verifyId == null) {
          console.log('doesn\'t get verify id, exit')
          return
        }
        this.$router.replace({
          path: '/DeepCert/show',
          query: { verifyId: verifyId }
        })
      } else {
        console.log('verify failed')
        this.back()
        this.$confirm('验证结果失败', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$router.replace({ path: '/DeepCert/index' })
        })
      }
    }
  }
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
