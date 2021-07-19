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
        prop="total_time"
        label="total_time"
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
export default {
  name: 'Step3',
  data() {
    return {
      tableData: [{
        epsilon: '0.01',
        robust_number: '1',
        unrobust_number: '0',
        has_adv_false_number: '0',
        misclassified_number: '55.94521522516516',
        total_time: '123'
      }],
      srcs: [
        { original: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', name_original: 'original image 0: Ankle boot', adversarial: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', name_adversarial: 'adversarial image 0: Sneake' },
        { original: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg', name_original: 'original image 0: Ankle boot', adversarial: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg', name_adversarial: 'adversarial image 0: Sneake' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
