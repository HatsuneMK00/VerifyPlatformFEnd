<template>
  <div>
    <div class="table">验证工具 DeepCert</div>
    <el-table
      :data="tableData"
      class="list_table"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >

      <el-table-column
        prop="set"
        label="数据集"
        class="td"
      />
      <el-table-column
        prop="model_name"
        label="模型"
        class="td"
      />
      <el-table-column
        prop="number"
        label="验证图片数量"
        class="td"
      />
      <el-table-column
        prop="times"
        label="总耗时"
        class="td"
      />
    </el-table>
    <el-row v-for="obj in objs" :key="obj" type="flex" justify="center" :gutter="30">
      <el-col :span="24" class="el-col">
        <div class="des">
          <div class="title">
            测试样本{{ obj.id }}
            <div>
              <span style="color: #909399 ;font-size: 15px;">验证耗时: {{ obj.time }}s</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">
            <span class="title">原始图片</span>
          </div>
          <img :src="obj.url1">
          <span class="label_class">{{ obj.lable }}</span>
        </div>
        <div :class="obj.text_class">
          <div class="robust_class">{{ obj.robust }}</div>
          <div class="robust_class">{{ obj.target_label }}</div>
        </div>
        <div :class="obj.img_class">
          <div class="title">
            <span class="title">无对抗样本</span>
          </div>
          <img src="@/assets/wrong.png">
          <div class="label_class">{{ obj.target_label }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import labelOpt from '@/store/modules/labels.js'
import { get } from './indexByQzt'
export default {
  name: 'Show',
  data() {
    return {
      verifyId: '',
      objs: [],
      tableData: [{
        model_name: '',
        number: '',
        set: '',
        times: ''
      }],
      labels: {}
    }
  },
  mounted() {
    this.getDatefrom()
  },
  methods: {
    getDatefrom() {
      this.verifyId = this.$route.query.verifyId
      // this.verifyId = 'e00187d86f6548288c8fda84779f8314'
      // this.verifyId = 'asdfqeruhasdfjh1387123'
      const params = new URLSearchParams()
      params.append('verifyId', this.verifyId)
      const verifyDeepCert = (params) =>
        get(`/verify/verification`, params)
      verifyDeepCert(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          // eslint-disable-next-line no-unused-vars
          this.labels = require('./labels').Labels.labels
          var count = 0
          var tatoltime = 0
          for (var temp in res.data.result) {
            count++
            if (res.data.result[temp].robustness !== undefined) {
              console.log(res.data.result[temp])
              var tempUrl = 'http://59.78.194.23:9091/deepcert/origin-image/' + res.data.result[temp].path + '?verifyId=' + this.verifyId
              var tempLable = res.data.result[temp].true_label
              var temRobust = res.data.result[temp].robustness
              var tempModel = res.data.result[temp].model
              var tempTartge = res.data.result[temp].target_label
              var tempTime = res.data.result[temp].compute_time
              this.tableData[0].model_name = tempModel.slice(7)
              var arr = this.tableData[0].model_name.split('_')
              console.log(tempLable)
              console.log(this.tableData[0].model_name)
              var tempLable1 = this.labels[arr[0]][tempLable]
              var tempTartge1 = this.labels[arr[0]][tempTartge]
              console.log(tempTartge)
              console.log(tempLable1)
              var time = parseFloat(tempTime)
              tatoltime += time
              this.objs.push({
                id: parseInt(temp) + 1,
                robust: '最小扰动半径：' + temRobust,
                lable: '标签：' + tempLable1,
                url1: tempUrl,
                target_label: '最小对抗样本标签：' + tempTartge1,
                time: tempTime,
                img_class: 'img2un',
                text_class: 'text'
              })
            } else {
              // eslint-disable-next-line no-redeclare
              var tempUrl = 'http://59.78.194.23:9091/deepcert/origin-image/' + res.data.result[temp].path + '?verifyId=' + this.verifyId
              // eslint-disable-next-line no-redeclare
              var tempTartge = '该图片神经网络未正确分类，不进行鲁棒性验证'
              // eslint-disable-next-line no-unused-vars
              this.objs.push({
                id: parseInt(temp) + 1,
                robust: '',
                lable: '标签：分类错误',
                url1: tempUrl,
                target_label: tempTartge,
                time: '0',
                img_class: 'img2',
                text_class: 'textun'
              })
            }
          }
          console.log(this.objs)
          this.tableData[0].number = count
          this.tableData[0].times = tatoltime
          // eslint-disable-next-line no-unused-vars
          this.tableData[0].set = arr[0]
        } else {
          alert(res.data.verificationStatus)
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.clearfix {
  *zoom: 1;
}

.clearfix::after,
.clearfix::before {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
*{
  padding: 0px;
  margin: 0px;
}
.table {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: "微软雅黑";
  padding: 30px;
  width: 100%;
}
.list_table{
  text-align: center;
  width: 50%;
  height: 100%;
  margin: 0 auto;
  margin-bottom: 20px;

}
.el-col{
  height: 400px;
  border-bottom: rgba(0,0,0,0.2) 1px solid;
  border-top: rgba(0,0,0,0.2) 1px solid;
}
.card{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  float: left;
  width: 30%;
  height: 336px;
  margin-left: 61px;
  text-align: center;
  letter-spacing: 3px;
  margin-top: 27px;
  span{
    font-size: 20px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 12px 0px;
    text-align: center;
  }
  img{
    font-size: 20px;
    display: inline-block;
    position: relative;
    width: 250px;
    margin: 0px 5%;
    text-align: center;
    position: relative;
    border: none;
    height: 250px;
    padding: 22px;
  }
  .label_class{
    font-size: 18px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 9px 0px;
    text-align: center;
  }

}
.text{
  display: block;
  float: left;
  height: 250px;
  padding: 20px;
  margin-top: 60px;
  margin: 0 auto;
  width: 30%;
  height: 250px;
  text-align: center;
  letter-spacing: 3px;
  margin-top: 120px;
}
.textun{
  display: none;
  float: left;
  height: 250px;
  padding: 20px;
  margin-top: 60px;
  margin: 0 auto;
  width: 30%;
  text-align: center;
  letter-spacing: 3px;
  margin-top: 120px;
}
.img2{
  display: block;
  float: left;
  height: 250px;
  padding: 20px;
  margin-top: 60px;
  margin: 0 auto;
  width: 30%;
  height: 336px;
  text-align: center;
  letter-spacing: 3px;
  margin-top: 7px;
  img{
    font-size: 20px;
    display: inline-block;
    position: relative;
    width: 250px;
    margin: 0px 5%;
    text-align: center;
    position: relative;
    border: none;
    height: 250px;
    padding: 46px;
  }
  span{
    font-size: 20px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 9px 0px;
    text-align: center;
  }
  .label_class{
    font-size: 18px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 9px 0px;
    text-align: center;
  }
}
.img2un{
  display: none;
  float: left;
  height: 250px;
  padding: 20px;
  margin-top: 60px;
  margin: 0 auto;
  width: 30%;
  height: 336px;
  text-align: center;
  letter-spacing: 3px;
  margin-top: 7px;
  img{
    font-size: 20px;
    display: inline-block;
    position: relative;
    width: 250px;
    margin: 0px 5%;
    text-align: center;
    position: relative;
    border: none;
    height: 250px;
  }
  span{
    font-size: 20px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 9px 0px;
    text-align: center;
  }
  .label_class{
    font-size: 18px;
    display: inline-block;
    position: relative;
    height: 20px;
    width: 100%;
    margin: 9px 0px;
    text-align: center;
  }
}
.des{
  float: left;
  margin: 0 auto;
  width: 30%;
  text-align: center;
  margin-top: 60px;
  vertical-align: middle;
  .title{
    padding: 100px;
    height: 250px;
    font-size: 23px;
    letter-spacing: 3px;
  }
}
.robust_class{
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 2px;
  margin: 27px 0px;
}

</style>
