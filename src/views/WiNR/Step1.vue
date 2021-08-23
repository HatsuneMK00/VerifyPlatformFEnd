<template>
  <div class="app-container">
    <h3 align="center">WiNR</h3>
    <el-steps :active="0" align-center>
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <el-form ref="ParaPack" :model="ParaPacket" class="register-container" label-width="200px">
      <el-form-item label="数据集：">
        <el-select v-model="ParaPacket.dataset" placeholder="请选择数据集" @change="datasetChange">
          <el-option label="cifar10" value="cifar10"></el-option>
          <el-option label="fashion_mnist" value="fashion_mnist"></el-option>
          <el-option label="gtsrb" value="gtsrb"></el-option>
        </el-select>
        <div class="el-tip">注意：更换数据集会使已上传的图片作废</div>
      </el-form-item>
      <el-form-item label="网络模型：">
        <el-upload
          ref="model-upload"
          action="http://219.228.60.69:9090/winr/model"
          name="modelFile"
          :on-success="handleSuccessMod"
          :on-preview="handlePreviewMod"
          :on-remove="handleRemoveMod"
          :limit="1"
          :on-exceed="handleExceedMod"
          :file-list="modelList"
        >
          <el-button size="small" type="primary">上传模型</el-button>
          <template #tip>
            <div class="el-tip">请上传1个H5文件</div>
            <div class="el-tip">激活函数目前只支持sigmoid</div>
            <div class="el-tip">网络只支持“卷积层+全连接层”或“卷积层+池化层+全连接层”</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="扰动值(Epsilon)：">
        <el-slider v-model="ParaPacket.epsilon" show-input :max="0.05" :step="0.005"></el-slider>
      </el-form-item>
      <el-form-item label="图片：">
        <el-upload
          ref="pic-upload"
          action="http://219.228.60.69:9090/winr/images"
          name="images"
          multiple
          :on-success="handleSuccessPic"
          :on-remove="handleRemovePic"
          :on-preview="handlePreviewPic"
          :before-upload="beforeUploadPic"
          :file-list="picList"
          list-type="picture"
        >
          <el-button size="small" type="primary">上传图片</el-button>
          <template #tip>
            <div v-if="ParaPacket.dataset=='cifar10'" class="el-tip">
              请上传尺寸为32×32的彩色JPG图片
            </div>
            <div v-else-if="ParaPacket.dataset=='fashion_mnist'" class="el-tip">
              请上传尺寸为28×28的灰度JPG图片
            </div>
            <div v-else-if="ParaPacket.dataset=='gtsrb'" class="el-tip">
              请上传尺寸为43×43的彩色JPG图片
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片标签：">
        <div v-if="ParaPacket.dataset==''">请先选择数据集</div>
        <div v-else>
          <el-form>
            <el-form-item v-for="(picItem) in picNameTagTableData" :label="picItem.name_user">
              <el-select v-model="picItem.tag" placeholder="请选择标签">
                <div v-if="ParaPacket.dataset=='cifar10'">
                  <el-option
                    v-for="opt1 in cifar10LabelOpt"
                    :label="opt1.label"
                    :value="opt1.value"
                  >
                  </el-option>
                </div>
                <div v-else-if="ParaPacket.dataset=='fashion_mnist'">
                  <el-option
                    v-for="opt1 in fashion_mnistLabelOpt"
                    :label="opt1.label"
                    :value="opt1.value"
                  >
                  </el-option>
                </div>
                <div v-else-if="ParaPacket.dataset=='gtsrb'">
                  <el-option
                    v-for="opt1 in gtsrbLabelOpt"
                    :label="opt1.label"
                    :value="opt1.value"
                  >
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button
        type="primary"
        round
        @click="submit_para"
        :disabled="this.ParaPacket.dataset == ''
        || this.ParaPacket.model == ''
        || this.picNameTagTableData.length == 0"
      >
        提交验证
      </el-button>
    </div>
  </div>
</template>

<script>
import labelOpt from '@/store/modules/labels.js'
import * as img from 'mockjs'

export default {
  name: 'Step1',
  data() {
    return {
      picPostURL: this.$axios.baseURL + '/winr/images',
      picList: [],
      modelList: [],
      // the table of the user model name and the server model name
      modelNameTable: '0',
      // the table of the user picture name and the tag
      picNameTagTableData: [],
      ParaPacket: {
        verifyId: '',
        model: '',
        epsilon: 0.01,
        dataset: '',
        testImageInfoJson: ''
      },
      cifar10LabelOpt: labelOpt.cifar10LabelOpt,
      fashion_mnistLabelOpt: labelOpt.fashion_mnistLabelOpt,
      gtsrbLabelOpt: labelOpt.gtsrbLabelOpt
    }
  },
  methods: {
    handleSuccessPic(response, file, fileList) {
      console.log('handleSuccessPic')
      console.log(response)
      console.log(file)
      if (response.status !== 200) {
        var resMsg = '失败！'
        if (response.status === -410) {
          resMsg = '失败！服务器没有收到。'
        } else if (response.status === -510) {
          resMsg = '失败！图片全部保存失败。'
        } else {
          resMsg = '失败！未知原因。'
        }
        this.$alert('图片上传' + resMsg, '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
        return
      }
      // get label from file name
      var tagPic = ''
      var numPos = file.name.indexOf('label_') + 6
      while (file.name.charAt(numPos) >= '0' && file.name.charAt(numPos) <= '9') {
        tagPic = tagPic * 10 + parseInt(file.name.charAt(numPos))
        numPos++
      }
      if ((this.ParaPacket.dataset == 'cifar10' && tagPic > this.cifar10LabelOpt.length - 1)
        || (this.ParaPacket.dataset == 'fashion_mnist' && tagPic > this.fashion_mnistLabelOpt.length - 1)
        || (this.ParaPacket.dataset == 'gtsrb' && tagPic > this.gtsrbLabelOpt.length - 1)) {
        tagPic = ''
      }
      // insert into picNameTag
      this.$set(
        this.picNameTagTableData,
        this.picNameTagTableData.length,
        { name_user: file.name, tag: tagPic, name_server: response.data.imageNames[0] }
      )
      console.log(fileList)
      console.log(this.picNameTagTableData)
      console.log(this.ParaPacket)
      console.log('handleSuccessPic end')
    },
    handleRemovePic(file, fileList) {
      console.log('handleRemovePic')
      console.log(file)
      // delete in fileList
      for (var i = 0; i < fileList.length; i++) {
        if (file.name === fileList[i].name) {
          fileList.splice(i, 1)
          break
        }
      }
      // delete in picNameTag
      for (var i = 0; i < this.picNameTagTableData.length; i++) {
        if (this.picNameTagTableData[i].name_user === file.name) {
          this.picNameTagTableData.splice(i, 1)
          break
        }
      }
      console.log(fileList)
      console.log(this.picNameTagTableData)
      console.log('handleRemovePic end')
    },
    handlePreviewPic(file) {
      // :on-preview="handlePreview"
      console.log('handlePreviewPic')
      console.log(file)
      console.log('handlePreviewPic end')
    },
    beforeUploadPic(file) {
      // :before-upload="beforeUploadPic"
      console.log('beforeUploadPic')
      console.log(file)
      // check format
      if (file.type !== 'image/jpeg') {
        this.$message.error('请上传JPG文件。')
        return false
      }
      // check size
      var picSideLength = 0
      if (this.ParaPacket.dataset === 'cifar10') {
        picSideLength = 32
      } else if (this.ParaPacket.dataset === 'fashion_mnist') {
        picSideLength = 28
      } else if (this.ParaPacket.dataset === 'gtsrb') {
        picSideLength = 43
      }
      console.log(picSideLength)
      const isSize = new Promise(function(resolve, reject) {
        let width = picSideLength
        let height = picSideLength
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
        console.log(img)
      }).then(() => {
        return file
      }, () => {
        this.$message.error('图片尺寸应为' + picSideLength + ' x ' + picSideLength + '.')
        return Promise.reject()
      })
      console.log('beforeUploadPic end')
      return isSize
    },
    handleSuccessMod(response, file, fileList) {
      console.log('handleSuccessMod')
      console.log(response)
      console.log(file)
      if (response.status !== 200) {
        var resMsg = '失败。'
        if (response.status === 510) {
          resMsg = '失败。服务器保存图片失败。'
        } else if (response.status !== 200) {
          resMsg = '失败。未知错误。'
        }
        this.$alert('模型上传' + resMsg, '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
        return
      }
      // insert into modelNameTable, but same name
      // this.$set(
      //   this.modelNameTable,
      //   this.modelNameTable.length,
      //   { name_user: fileList[fileList.length - 1].name, name_server: response.data.modelFilename }
      // )
      // put into ParaPacket
      this.ParaPacket.model = response.data.modelFilename
      console.log(this.modelNameTable)
      console.log(this.ParaPacket)
      console.log('handleSuccessMod end')
    },
    handleRemoveMod(file, fileList) {
      console.log('handleRemoveMod')
      console.log(file)
      // delete in fileList
      for (var i = 0; i < fileList.length; i++) {
        if (file.name === fileList[i].name) {
          fileList.splice(i, 1)
          break
        }
      }
      // delete in modelNameTable
      // this.modelNameTable.splice(file.name, 1)
      // change ParaPacket
      this.ParaPacket.model = '0'
      console.log(fileList)
      console.log(this.ParaPacket)
      console.log('handleRemoveMod end')
    },
    handlePreviewMod(file) {
      // :on-preview="handlePreviewMod"
      console.log('handlePreviewMod')
      console.log(file)
      console.log('handlePreviewMod end')
    },
    handleExceedMod(files, fileList) {
      console.log('handleExceedMod')
      this.$alert('只能上传一个模型。', '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
        }
      })
      console.log('handleExceedMod end')
    },
    datasetChange() {
      console.log('dataset change')
      // remove pictures in pic-list
      this.$refs['pic-upload'].clearFiles()
      // remove rows in picNameTagTableData
      while (this.picNameTagTableData.length !== 0) {
        this.picNameTagTableData.splice(this.picNameTagTableData.length - 1, 1)
      }
      console.log('dataset change end')
    },
    GetLabelOption() {
      if (this.ParaPacket.dataset !== '') {
        var re = 'opt1 in ' + this.ParaPacket.dataset + 'LabelOpt'
        console.log(re)
        return re
      }
      return ''
    },
    async submit_para() {
      // get verify_id and put into ParaPacket
      await this.get_vid()
      // post parameter, if success, will jump to next page
      // else, will jump to index page
      this.post_para()
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
      // generate testImageInfoJson
      this.ParaPacket.testImageInfoJson = '{'
      for (var i = 0; i < this.picNameTagTableData.length; i++) {
        this.ParaPacket.testImageInfoJson += '"' + this.picNameTagTableData[i].name_server + '": "' + this.picNameTagTableData[i].tag + '"'
        if (i !== this.picNameTagTableData.length - 1) {
          this.ParaPacket.testImageInfoJson += ', '
        } else {
          this.ParaPacket.testImageInfoJson += '}'
        }
      }
      console.log('post para')
      console.log(this.ParaPacket)
      var isSuccess = false
      // post parameter
      await this.$axios
        .post('/verify/winr/' + this.$store.getters.userId, this.ParaPacket)
        .then((res) => {
          console.log(res)
          if (res.data.status === 200) {
            isSuccess = true
            this.$alert('验证提交成功。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          } else {
            var resMsg = '0'
            if (res.data.status === -100) {
              resMsg = 'Websocket未建立。'
            } else if (res.data.status === -400) {
              resMsg = '参数错误。'
            } else if (res.data.status === 410) {
              resMsg = '缺少VID。'
            } else if (res.data.status === 420) {
              resMsg = '无法向工具传递验证参数。'
            } else if (res.data.status === 430) {
              resMsg = '参数错误。'
            } else if (res.data.status === 440) {
              resMsg = '模型或图片不存在，请先上传。'
            } else {
              resMsg = '未知原因。'
            }
            this.$alert('验证提交失败！' + resMsg + '将返回工具首页。验证编号为：' + this.ParaPacket.verifyId, '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
              }
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      if (isSuccess) {
        this.next_step()
      } else {
        this.to_index()
      }
    }
    // created: function() {
    //   this.cifar10LabelOpt = require('./labels').cifar10LabelOpt
    //   this.fashion_mnistLabelOpt = require('./labels').fashion_mnistLabelOpt
    //   this.gtsrbLabelOpt = require('./labels').gtsrbLabelOpt
    // }
  }
}
</script>

<style scoped>
.el-tip {
  font-family: "微软雅黑";
  font-size: 14px;
  color: #929497;
}
</style>
