<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="0" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <el-form ref="ParaPack" :model="ParaPacket" class="register-container" label-width="200px">
      <el-form-item label="数据集：">
        <!--        <el-input type="text" v-model="ParaPack.dataset" clearable></el-input>-->
        <el-select v-model="ParaPacket.dataset" placeholder="请选择数据集">
          <el-option label="cifar10" value="cifar10"></el-option>
          <el-option label="fashion_mnist" value="fashion_mnist"></el-option>
          <el-option label="gtsrb" value="gtsrb"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网络模型：">
        <!--        <el-input type="text" v-model="ParaPack.para1" clearable></el-input>-->
        <el-select v-model="ParaPacket.model" placeholder="请选择网络模型">
          <el-option
            label="cifar10_cnn_lenet_averpool_sigmoid_myself"
            value="models/cifar10_cnn_lenet_averpool_sigmoid_myself.h5"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_4layer_5_3_sigmoid_myself"
            value="models/fashion_mnist_cnn_4layer_5_3_sigmoid_myself.h5"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_6layer_5_3_sigmoid_myself"
            value="models/fashion_mnist_cnn_6layer_5_3_sigmoid_myself.h5"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_8layer_5_3_sigmoid_myself"
            value="models/fashion_mnist_cnn_8layer_5_3_sigmoid_myself.h5"
          ></el-option>
          <el-option
            label="fashion_mnist_cnn_10layer_5_3_sigmoid_myself"
            value="models/fashion_mnist_cnn_10layer_5_3_sigmoid_myself.h5"
          ></el-option>
          <el-option
            label="gtsrb_cnn_5layer_sigmoid_myself"
            value="models/gtsrb_cnn_5layer_sigmoid_myself.h5"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扰动值(Epsilon)：">
        <el-col :span="6">
          <el-input type="text" v-model="ParaPacket.epsilon" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="pic-upload"
          action="http://219.228.60.69:9090/winr/images"
          name="images"
          :on-success="handleSuccessPic"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">上传图片</el-button>
          <!--          <template #tip>-->
          <!--            <div class="el-upload__tip">-->
          <!--              只能上传 jpg/png 文件，且不超过 500kb-->
          <!--            </div>-->
          <!--          </template>-->
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="picNameTagTableData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="图片名"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="tag"
            label="标签"
          >
          </el-table-column>
        </el-table>
      </el-form-item>
      <!--      <el-form-item label="图片数量：">-->
      <!--        <el-col :span="6">-->
      <!--          <el-input type="text" v-model="ParaPacket.imageNum" clearable></el-input>-->
      <!--        </el-col>-->
      <!--      </el-form-item>-->
    </el-form>
    <div align="center">
      <el-button type="primary" round @click="submit_para">下一步</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Step1',
  data() {
    return {
      picPostURL: this.$axios.baseURL + '/winr/images',
      fileList: [],
      // the map of the user picture name to the server picture name
      // the key is user pic name, the value is serve pic name
      picNameMap: '0',
      // the table of the user picture name and the tag
      picNameTagTableData: [],
      ParaPacket: {
        verifyId: '',
        model: '',
        epsilon: '',
        dataset: '',
        // imageNum: '',
        testImageInfo: '0'
      }
    }
  },
  methods: {
    GetUploadURL() {
      return this.$axios.baseURL + '/winr/images'
    },
    handleSuccessPic(response, file, fileList) {
      if (this.ParaPacket.testImageInfo === '0') {
        this.ParaPacket.testImageInfo = new Map()
      }
      if (this.picNameMap === '0') {
        this.picNameMap = new Map()
      }
      console.log('handleSuccessPic')
      console.log(response)
      console.log(file)
      if (response.status === -410) {
        this.$alert('图片上传失败！服务器没有收到。', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
      } else if (response.status === -510) {
        this.$alert('图片上传失败！图片全部保存失败。', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
      } else if (response.status === 200) {
        this.$alert('图片上传成功！（' + response.data.successSave + '/' + response.data.imageUpload + '）', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
        // set tag in parameter
        var tagPic = prompt('请输入图片' + fileList[fileList.length - 1].name + '的标签')
        this.ParaPacket.testImageInfo.set(response.data.imageNames[0], tagPic)
        // store name map
        this.picNameMap.set(fileList[fileList.length - 1].name, response.data.imageNames[0])
        // insert into picNameTag
        this.$set(
          this.picNameTagTableData,
          this.picNameTagTableData.length,
          { name: fileList[fileList.length - 1].name, tag: tagPic }
        )
        console.log(this.picNameTagTableData)
      } else {
        this.$alert('图片上传失败！未知原因。', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
      }
      console.log(fileList)
      console.log(this.ParaPacket)
      console.log('handleSuccessPic end')
    },
    handleRemove(file, fileList) {
      console.log('handleRemove')
      console.log(file)
      // delete in fileList
      for (var i = 0; i < fileList.length; i++) {
        if (file.name === fileList[i].name) {
          fileList.splice(i, 1)
          break
        }
      }
      // delete in ParaPacket
      var serPicName = this.picNameMap.get(file.name)
      if (this.ParaPacket.testImageInfo.has(serPicName)) {
        this.ParaPacket.testImageInfo.delete(serPicName)
      }
      // delete in picNameTag
      this.picNameTagTableData.splice(file.name, 1)
      console.log(fileList)
      console.log(this.ParaPacket)
      console.log('handleRemove end')
    },
    handlePreview(file) {
      // :on-preview="handlePreview"
      console.log('handlePreview')
      console.log(file)
      console.log('handlePreview end')
    },
    async submit_para() {
      // get verify_id and put into ParaPacket
      await this.get_vid()
      // post parameter, if success, will jump to next page
      this.post_para()
      // jump to /winr/index
      this.to_index()
    },
    next_step() {
      this.$router.replace({ path: '/WiNR/step2' })
    },
    to_index() {
      this.$router.replace({ path: '/WiNR/index' })
    },
    async get_vid() {
      // get verify_id and put into ParaPacket
      await this.$axios
        .get('/verify/verify_id')
        .then((res) => {
          this.ParaPacket.verifyId = res.data.data.verifyId
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    async post_para() {
      // post parameter
      await this.$axios
        .post('/verify/winr/' + this.$store.getters.userId, this.ParaPacket)
        .then((res) => {
          // console.log(res)
          if (res.data.status === 200) {
            this.$alert('验证提交成功。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
            // submit success, to next page
            this.next_step()
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
          } else if (res.data.status === 410) {
            this.$alert('验证提交失败！缺少VID。将返回工具首页。' + this.ParaPacket.verifyId, '提示', {
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
    }
  }
}
</script>

<style scoped>

</style>
