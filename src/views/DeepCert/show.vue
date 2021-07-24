<template>
  <div class="box1">
    <div class="box2">
      <div class="img_box">
        <img src="@/assets/logo.png" alt="wu">
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="model_name"
          label="model_name"
          width="200">
        </el-table-column>
        <el-table-column
          prop="num_image"
          label="num_image"
          width="200">
        </el-table-column>
        <el-table-column
          prop="target_type"
          label="target_type"
          width="200">
        </el-table-column>
        <el-table-column
          prop="avg_robustness"
          label="avg_robustness"
          width="200">
        </el-table-column>
        <el-table-column
          prop="avg_run_time"
          label="avg_run_time"
          width="200">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Show',
  data() {
    return {
      verifyId: 'e2f7100781c54416be110f6a274dd766',
      tableData: [{
        model_name: 'asc',
        num_image: '',
        target_type: '',
        avg_robustness: '',
        avg_run_time: ''
      }]
    }
  }
}

</script>

<style lang="scss" scoped>
.box1 {
  background-color: aquamarine;
  height: 100%;
}
.box2 {
  width: 1000px;
  height: 300px;
  border-radius: 3px;
  background-color: aliceblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .img_box {
    height: 130px;
    width: 130px;
    border: 1px solid aliceblue;
    position: absolute;
    border-radius: 50%;
    padding: 10px;
    left: 50%;
    transform: translate(-50%,-150%);
    box-shadow: 0 0 10px aliceblue;
    background-color: aliceblue;
    img{
      height: 100%;
      width: 100%;
      background-color: aliceblue;
      border-radius: 50%;
    }
  }
}

</style>
