<template>
  <div class="app-container">
    <h3 align="center">WiNR 工具</h3>
    <el-steps :active="2" align-center finish-status="success">
      <el-step title="参数选择"></el-step>
      <el-step title="开始验证"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin: 14px 0px 14px 0px">
      <el-table-column
        prop="epsilon"
        label="epsilon"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="robust_number"
        label="robust_number"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="unrobust_number"
        label="unrobust_number"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="has_adv_false_number"
        label="has_adv_false_number"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="misclassified_number"
        label="misclassified_number"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="total_runtime"
        label="total_runtime"
        align="center">
      </el-table-column>
    </el-table>
    <el-row v-for="src in srcs" :key="src" type="flex" justify="center">
      <el-col :span="8" >
        <el-card align="middle"  :body-style="{ padding: '20px' }">
          <div>
            <img style="object-fit: contain; width: 300px; height: 300px" :src="src.original" class="image">
          </div>
          <div style="padding: 16px 0px 0px 0px;">
            <span>{{ src.name_original }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" >
        <el-card align="middle"  :body-style="{ padding: '20px' }">
          <div>
            <img style="object-fit: contain; width: 300px; height: 300px" :src="src.adversarial" class="image">
          </div>
          <div style="padding: 16px 0px 0px 0px;">
            <span>{{ src.name_adversarial }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { verification } from '../../api/verification'
export default {
  name: 'Step3',
  data() {
    return {
      verifyID: '',
      tableData: [{
        epsilon: '0.01',
        robust_number: '1',
        unrobust_number: '0',
        has_adv_false_number: '0',
        misclassified_number: '55.94521522516516',
        total_runtime: '123'
      }],
      srcs: [
        { original: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', name_original: 'original image 0: Ankle boot', adversarial: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', name_adversarial: 'adversarial image 0: Sneake' },
        { original: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg', name_original: 'original image 0: Ankle boot', adversarial: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg', name_adversarial: 'adversarial image 0: Sneake' }
      ]
      // srcs: []
    }
  }
  /* zkl : because of the lack of the websocket, interactive is noted */
  // created: function() {
  //   this.verifyID = this.$route.query.verifyID
  //   verification(this.verifyID).then((res) => {
  //     this.tableData[0].epsilon = res.data.data.result.eps_0
  //     this.tableData[0].robust_number = res.data.data.result.robust_number
  //     this.tableData[0].unrobust_number = res.data.data.result.unrobust_number
  //     this.tableData[0].has_adv_false_number = res.data.data.result.has_adv_false_number
  //     this.tableData[0].misclassified_number = res.data.data.result.misclassified_number
  //     this.tableData[0].total_runtime = res.data.data.result.total_runtime
  //     for (let i = 0; i < res.data.data.advExamples.length - 1; i++) {
  //       this.srcs.push({ original: res.data.data.advExamples[i], adversarial: res.data.data.advExamples[i + 1] })
  //     }
  //   })
  // }
}
</script>

<style scoped>

</style>
