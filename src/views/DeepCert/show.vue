<template>
  <div>
    <div class="table">模型使用的是：{{ model_name }}</div>
    <el-row v-for="obj in objs" :key="obj" type="flex" justify="center">
      <el-col :span="8">
        <el-card align="middle" :body-style="{ padding: '20px' }">
          <div>
            <img style="object-fit: contain; width: 300px; height: 300px" :src="obj.url1" class="image">
          </div>
          <div style="padding: 16px 0px 0px 0px;">
            <div class="label_class">标签：{{ obj.lable }}</div>
            <div class="robust_class">最小扰动半径：{{ obj.robust }}</div>
            <div class="label_class">最小对抗样本标签：{{ obj.target_label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get } from './indexByQzt'
export default {
  name: 'Show',
  data() {
    return {
      model_name: '',
      verifyId: '',
      objs: []
    }
  },
  mounted() {
    this.getDatefrom()
  },
  methods: {
    getDatefrom() {
      // this.verifyId = this.$route.query.verifyId
      this.verifyId = 'asdfqeruhasdfjh1387123'
      const params = new URLSearchParams()
      params.append('verifyId', this.verifyId)
      const verifyDeepCert = (params) =>
        get(`/verify/verification`, params)
      verifyDeepCert(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          for (var temp in res.data.result) {
            console.log(res.data.result[temp])
            var tempUrl = 'http://219.228.60.69:9090/deepcert/origin-image/' + res.data.result[temp].path + '?verifyId=' + this.verifyId
            var tempLable = res.data.result[temp].true_label
            var temRobust = res.data.result[temp].robustness
            var tempModel = res.data.result[temp].model
            var tempTartge = res.data.result[temp].target_label
            this.model_name = tempModel.slice(7)
            console.log(this.model_name)
            this.objs.push({
              robust: temRobust,
              lable: tempLable,
              url1: tempUrl,
              target_label: tempTartge
            })
            console.log(this.objs[temp])
          }
        } else {
          alert(res.data.verificationStatus)
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.table {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: "微软雅黑";
  padding: 30px;
  width: 100%;
}
</style>
