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
        <div v-show="isDisplay">
            <el-form
              :model="ruleForm"
              ref="ruleFrom"
              label-width="200px"
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
                >
                  <el-button type="primary">点击上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item label="图片标签：">
               <div>
                 <el-form>
                   <!-- eslint-disable -->
                   <el-form-item v-for="(picItem) in picTable" :label="picItem.name">
                     <el-select v-model="picItem.tag" placeholder="请选择标签">
                         <el-option
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

              <el-form-item prop="norm" label="扰动半径度量标准">
                <el-radio v-model="ruleForm.norm" label="1">L1范数</el-radio>
                <el-radio v-model="ruleForm.norm" label="2">L2范数</el-radio>
                <el-radio v-model="ruleForm.norm" label="i">无穷范数</el-radio>
              </el-form-item>
            </el-form>

            <div style="text-align:center">
              <el-button type="primary" round @click="verify">开始计算鲁棒半径</el-button>
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
import labelOpt from '@/store/modules/labels.js'
export default {
  data() {
    return {
      isDisplay: false,
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
      numberPicLabelOpt: labelOpt.numberPicLabelOpt
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
      this.initalName = param.file.name; 
      this.$set(
        this.picTable, 
        this.picTable.length, {
        name: this.initalName,
        tag: "",
      });
      let upData = new FormData();
      upData.append("images", param.file);
      post("/deepcert/images", upData).then((res) => {
        if (res.status == 200) {
          this.notify("图片上传成功", "success");
          for (let i = 0; i < res.data.imageNames.length; i++) {
            this.imageName.push(res.data.imageNames[i]);
          }
        } else {
          this.notify("图片上传失败", "error");
        }
      });  
    },
    httpRequest2(param) {
      this.modelFile = param.file;
      let upData = new FormData();
      upData.append("modelFile", this.modelFile);
      this.ruleForm.netName = this.modelFile.name;
      post("/deepcert/model", upData).then((res) => {
        if (res.status == 200) {
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
           }
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
          params.append("norm", this.ruleForm.norm);
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
              console.log(res.status);
              console.log(this.ruleForm.testImageInfoJson);
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
