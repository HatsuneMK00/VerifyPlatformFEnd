<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="2" align-center finish-status="success">
      <el-step title="参数选择" />
      <el-step title="开始验证" />
      <el-step title="查看结果" />
    </el-steps>
    <el-row v-for="image in images" :key="image.imageId" class="row" type="flex" justify="center">
      <el-col :span="8">
        <el-card align="middle" :body-style="{ padding: '20px' }">
          <div>
            <img :src="image.originImages" class="image">
          </div>
          <div class="description">
            <span>original</span>
          </div>
          <div class="description">
            <span>label: {{ image.originLabel }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card align="middle" :body-style="{ padding: '20px' }">
          <div class="img_box" v-if="image.robust === 'True'">
            <img src="@/assets/logo.png" class="logo_img">
          </div>
          <div v-else-if="image.misclassified === 'True'" class="img_box">
            <img src="@/assets/question.png" class="logo_img">
          </div>
          <div v-else>
            <img :src="image.advExamples" class="image">
          </div>
          <div v-if="image.unrobust === 'True'" class="description">
            <span v-html="'adversarial&nbsp;&nbsp;&nbsp;&nbsp;'"></span>
            <span>eps: {{ image.eps }}</span>
          </div>
          <div v-else class="description">
            <span>no adversarial</span>
          </div>
          <div v-if="image.robust === 'True'" class="description">
            <span>This image is robust</span>
          </div>
          <div v-else-if="image.misclassified === 'True'" class="description">
            <span>This image is misclassified</span>
          </div>
          <div v-else class="description">
            <span style="white-space: pre">label: {{ image.advLabel }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.row {
  margin: 20px 0px 20px 0px
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
</style>

<script>
import { verification } from '../../api/verification'
export default {
  name: 'Step3',
  data() {
    return {
      verifyId: '',
      labels: {
        fashion: {
          0: 'T-shirt',
          1: 'Trouser',
          2: 'Pullover',
          3: 'Dress',
          4: 'Coat',
          5: 'Sandal',
          6: 'Shirt',
          7: 'Sneaker',
          8: 'Bag',
          9: 'Ankle boot'
        },
        cifar10: {
          0: 'Airplane',
          1: 'Automobile',
          2: 'Bird',
          3: 'Cat',
          4: 'Deer',
          5: 'Dog',
          6: 'Frog',
          7: 'Horse',
          8: 'Ship',
          9: 'Truck'
        },
        gtsrb: {
          0: 'Speed limit (20km/h)',
          1: 'Speed limit (30km/h)',
          2: 'Speed limit (50km/h)',
          3: 'Speed limit (60km/h)',
          4: 'Speed limit (70km/h)',
          5: 'Speed limit (80km/h)',
          6: 'End of speed limit (80km/h)',
          7: 'Speed limit (100km/h)',
          8: 'Speed limit (120km/h)',
          9: 'No passing',
          10: 'No passing for vehicles over 3.5 metric tons',
          11: 'Right-of-way at the next intersection',
          12: 'Priority road',
          13: 'Yield',
          14: 'Stop',
          15: 'No vehicles',
          16: 'Vehicles over 3.5 metric tons prohibited',
          17: 'No entry',
          18: 'General caution',
          19: 'Dangerous curve to the left',
          20: 'Dangerous curve to the right',
          21: 'Double curve',
          22: 'Bumpy road',
          23: 'Slippery road',
          24: 'Road narrows on the right',
          25: 'Road work',
          26: 'Traffic signals',
          27: 'Pedestrians',
          28: 'Children crossing',
          29: 'Bicycles crossing',
          30: 'Beware of ice/snow',
          31: 'Wild animals crossing',
          32: 'End of all speed and passing limits',
          33: 'Turn right ahead',
          34: 'Turn left ahead',
          35: 'Ahead only',
          36: 'Go straight or right',
          37: 'Go straight or left',
          38: 'Keep right',
          39: 'Keep left',
          40: 'Roundabout mandatory',
          41: 'End of no passing',
          42: 'End of no passing by vehicles over 3.5 metric tons'
        }
      },
      images: []
    }
  },
  created: function() {
    this.verifyId = this.$route.query.verifyId
    // this.verifyId = 'uwery134r132'
    verification(this.verifyId).then((res) => {
      if (res.status === 200) {
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
