<template>
  <div class="box2">
    <div class="img_box">
      <img src="@/assets/logo.png" alt="wu">
    </div>
    <div class="table">模型使用的是：{{ model_name }}</div>
    <div class="box1">
      <div class="demo-image">
        <div v-for="obj in objs" :key="obj" class="block">
          <div class="robust_class">最小扰动半径：{{ obj.robust }}</div>
          <div class="label_class">标签：{{ obj.lable }}</div>
          <el-image
            style="width: 200px; height: 200px"
            :src="obj.url1"
            fit="fill"
            onerror="javascript:this.src='@/assets/error.png'"
          />
        </div>
      </div>
    </div>
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
      this.verifyId = this.$route.query.verifyId
      // this.verifyId = 'asdfqeruhasdfjh1387123'
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
            this.model_name = tempModel.slice(7)
            console.log(this.model_name)
            this.objs.push({
              robust: temRobust,
              lable: tempLable,
              url1: tempUrl
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
.box2 {
  width: 100%;
  height: 30%;
  border-radius: 3px;
  position: center;
  .img_box {
    height: 130px;
    width: 130px;
    border: 1px solid aliceblue;
    position: absolute;
    border-radius: 50%;
    padding: 10px;
    left: 50%;
    transform: translate(-50%);
    box-shadow: 0 0 10px aliceblue;
    background-color: aliceblue;
    img{
      height: 100%;
      width: 100%;
      background-color: aliceblue;
      border-radius: 50%;
    }
  }
  .table{
    position: absolute;
    left: 50%;
    transform: translate(-50%,800%);
  }
}
.box1{
  width: 100%;
  height: 70%;
  position: absolute;
  transform: translate(0,50%);
  .block{
    width: 200px;
    height: 100px;
    display: inline-block;
    padding: 10px;
    margin: 10px;
  }
  .demo-image{
    position: center;
  }
}

</style>
