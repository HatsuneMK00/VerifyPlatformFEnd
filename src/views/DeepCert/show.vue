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
        prop="model_name"
        label="模型"
        width="180"
        class="td"
      />
      <el-table-column
        prop="number"
        label="验证图片数量"
        width="180"
        class="td"
      />
    </el-table>
    <div class="pic">
      <el-row v-for="obj in objs" :key="obj" type="flex" justify="center" :gutter="30">
        <el-col :span="12" class="el-col">
          <el-card align="middle" :body-style="{ padding: '20px', margin: '0px'}" class="el-card__body">
            <div>
              <div class="lable">测试样本{{ obj.id }}</div>
              <div class="inner clearfix">
                <img style="object-fit: contain; width: 75px; height: 75px" :src="obj.url1" :class="obj.imge_class">
                <div class="label_class">{{ obj.lable }}</div>
              </div>
            </div>
            <div style="padding: 16px 0px 0px 0px;">
              <div class="robust_class">{{ obj.robust }}</div>
              <div class="label_class2">{{ obj.target_label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { get } from './indexByQzt'
export default {
  name: 'Show',
  data() {
    return {
      verifyId: '',
      objs: [],
      tableData: [{
        model_name: '',
        number: ''
      }]
    }
  },
  mounted() {
    this.getDatefrom()
  },
  methods: {
    getDatefrom() {
      // this.verifyId = this.$route.query.verifyId
      this.verifyId = 'e00187d86f6548288c8fda84779f8314'
      // this.verifyId = '563d4a42670045ed8dd0212f0c60c091'
      const params = new URLSearchParams()
      params.append('verifyId', this.verifyId)
      const verifyDeepCert = (params) =>
        get(`/verify/verification`, params)
      verifyDeepCert(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          // eslint-disable-next-line no-unused-vars
          var count = 0
          for (var temp in res.data.result) {
            count++
            if (res.data.result[temp].robustness !== undefined) {
              console.log(res.data.result[temp])
              var tempUrl = 'http://219.228.60.69:9090/deepcert/origin-image/' + res.data.result[temp].path + '?verifyId=' + this.verifyId
              var tempLable = res.data.result[temp].true_label
              var temRobust = res.data.result[temp].robustness
              var tempModel = res.data.result[temp].model
              var tempTartge = res.data.result[temp].target_label
              this.tableData[0].model_name = tempModel.slice(7)
              this.objs.push({
                id: parseInt(temp) + 1,
                robust: '最小扰动半径：' + temRobust,
                lable: '标签：' + tempLable,
                url1: tempUrl,
                target_label: '最小对抗样本标签：' + tempTartge,
                imge_class: 'image'
              })
            } else {
              // eslint-disable-next-line no-redeclare
              var tempUrl = 'http://219.228.60.69:9090/deepcert/origin-image/' + res.data.result[temp].path + '?verifyId=' + this.verifyId
              // eslint-disable-next-line no-redeclare
              var tempTartge = '该图片神经网络未正确分类，不进行鲁棒性验证'
              this.objs.push({
                id: parseInt(temp) + 1,
                robust: '',
                lable: '',
                url1: tempUrl,
                target_label: tempTartge,
                imge_class: 'image1'
              })
            }
          }
          console.log(this.objs)
          this.tableData[0].number = count
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
  width: 360px;
  height: 100%;
  margin: 0 auto;

}
.pic {
  margin: 5% auto;
  overflow: hidden;

}
.el-row{
  float: left;
  margin: 0 auto;
  width: 50%;
}
.el-card{
  width: 25%;
  height: 360px;
  margin-bottom: 50px;
}
.el-card__body{
  width: 400px;
}
.robust_class,.label_class2{
  font-size: 20px;
  padding: 10px;
}
.lable{
  font-size: 25px;
  padding: 20px;
}
.inner{
  height: 100px;
  width: 200px;
  position: relative;
}
.inner .label_class{
  position: absolute;
  right: 20px;
  top: 30px;
}
.inner .image{
  position: absolute;
  left: 0;
  top: 10px;

}
.inner .image1{
  position: absolute;
  left: 60px;
  top: 10px;
}
</style>
