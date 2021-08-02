<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="2" align-center finish-status="success">
      <el-step title="参数选择" />
      <el-step title="开始验证" />
      <el-step title="查看结果" />
    </el-steps>
    <el-table
      :data="tableData"
      cell-style="font-size: 16px"
      header-cell-style="font-size: 16px"
      style="width: 60%; margin: 30px auto 20px auto">
      <el-table-column
        prop="tool"
        label="工具"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="eps"
        label="扰动半径"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="dataset"
        label="数据集"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="netName"
        label="网络参数"
        align="center">
      </el-table-column>
    </el-table>
    <el-row v-for="image in images" :key="image.imageId" class="row">
      <el-divider></el-divider>
      <el-col :span="4" class="col">
        <div align="middle" style="margin-top: 200px">
          <span class="title">测试用例{{ image.imageId+1 }}</span>
        </div>
      </el-col>
      <el-col :span="8" class="col">
        <el-card align="middle" :body-style="{ padding: '20px' }">
          <div class="description">
            <span class="title">原始图片</span>
          </div>
          <div>
            <img :src="image.originImages" class="image">
          </div>
          <div class="description">
            <span>标签: {{ image.originLabel }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="col">
        <el-card align="middle" :body-style="{ padding: '20px 0 20px 0' }">
          <div v-if="image.unrobust === 'True'" class="description">
            <span class="title_thin">扰动半径</span>
            <span style="font-size: 20px; font-weight: 500"> epsilon = {{ image.eps }} </span>
            <span class="title_thin">时的对抗样本</span>
          </div>
          <div v-else class="description">
            <span class="title">无对抗样本</span>
          </div>
          <div v-if="image.robust === 'True'" class="img_box">
            <img src="@/assets/logo.png" class="logo_img">
          </div>
          <div v-else-if="image.misclassified === 'True'" class="img_box">
            <img src="@/assets/question.png" class="logo_img">
          </div>
          <div v-else>
            <img :src="image.advExamples" class="image">
          </div>
          <div v-if="image.robust === 'True'" class="description">
            <span>该图片在该扰动半径下是鲁棒的</span>
          </div>
          <div v-else-if="image.misclassified === 'True'" class="description">
            <span>该图片神经网络未正确分类，不进行鲁棒性验证</span>
          </div>
          <div v-else class="description">
            <span>标签: {{ image.advLabel }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.row {
  margin: 0;
}
.col {
  margin: 10px 0 10px 0;
}
.image {
  object-fit: contain;
  width: 300px;
  height: 300px
}
.description {
  padding: 16px 0px 0px 0px
}
.img_box {
  width: 300px;
  height: 300px;
  padding: 75px ;
  margin-bottom: 4px
}
.logo_img {
  object-fit: contain;
  width: 150px;
  height: 150px
}
.title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
}
.title_thin {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
}
</style>

<script>
import { verification } from '../../api/verification'
export default {
  name: 'Step3',
  data() {
    return {
      verifyId: '',
      tableData: [{
        tool: 'WiNR',
        eps: '',
        dataset: '',
        netName: ''
      }],
      labels: {},
      images: []
    }
  },
  created: function() {
    this.verifyId = this.$route.query.verifyId
    // this.verifyId = 'uwery134r132'
    verification(this.verifyId).then((res) => {
      if (res.status === 200) {
        this.labels = require('./labels').Labels.labels
        this.tableData[0].eps = res.data.verificationDetail.epsilon
        this.tableData[0].dataset = res.data.verificationDetail.dataset
        this.tableData[0].netName = res.data.verificationDetail.netName.split('.')[0]
        var flag = 0
        var imageKey = ''
        var tempUrl = []
        var tempOrigin = {}
        for (let i = 0; i < res.data.originImages.length; i++) {
          tempUrl = res.data.originImages[i].split('_')
          imageKey = 'image_' + tempUrl.slice(-4, -3)[0][0]
          tempOrigin[imageKey] = {
            originLabel: this.labels[tempUrl[0]][tempUrl.slice(-1)[0][0]],
            originImages: 'http://219.228.60.69:9090/winr/origin-image/' + res.data.originImages[i] + '?verifyId=' + this.verifyId
          }
        }
        var tempAdv = {}
        for (let i = 0; i < res.data.advExamples.length; i++) {
          tempUrl = res.data.advExamples[i].split('_')
          imageKey = 'image_' + tempUrl.slice(-4, -3)[0][0]
          tempAdv[imageKey] = {
            advLabel: this.labels[tempUrl[0]][tempUrl.slice(-1)[0][0]],
            advExamples: 'http://219.228.60.69:9090/winr/adv_image/' + res.data.advExamples[i] + '?verifyId=' + this.verifyId,
            eps: tempUrl.slice(-9, -8)[0]
          }
        }
        var tempImage = {}
        // eslint-disable-next-line no-unmodified-loop-condition
        for (let i = 0; flag === 0; i++) {
          imageKey = 'image_' + i
          tempImage = res.data.result[imageKey]
          if (!tempImage) {
            flag = 1
            break
          } else {
            this.images.push({
              imageId: i,
              misclassified: tempImage.misclassified,
              robust: tempImage.robust,
              unrobust: tempImage.unrobust,
              time_sum: tempImage.time_sum,
              unknown: tempImage.unknown
            })
            this.images[i]['originImages'] = tempOrigin[imageKey].originImages
            this.images[i]['originLabel'] = tempOrigin[imageKey].originLabel
            if (tempImage.unrobust === 'True') {
              this.images[i]['advLabel'] = tempAdv[imageKey].advLabel
              this.images[i]['advExamples'] = tempAdv[imageKey].advExamples
              this.images[i]['eps'] = tempAdv[imageKey].eps
            }
            console.log(this.images[i])
          }
        }
      } else {
        alert(res.data.verificationStatus)
      }
    })
  }
}
</script>
