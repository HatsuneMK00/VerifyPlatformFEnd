<template>
  <div class="history-container">
    <h3 align="center">历史验证记录</h3>
    <el-table
      :data="recordTableData"
      height="500"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-if="props.row.netName != null">
              <el-form-item label="网络模型"><span>{{ props.row.netName }}</span></el-form-item>
            </div>
            <div v-if="props.row.dataset != null">
              <el-form-item label="数据集"><span>{{ props.row.dataset }}</span></el-form-item>
            </div>
            <div v-if="props.row.epsilon != null">
              <el-form-item label="扰动值epsilon"><span>{{ props.row.epsilon }}</span></el-form-item>
            </div>
            <div v-if="props.row.norm != null">
              <el-form-item label="范式"><span>{{ props.row.norm }}</span></el-form-item>
            </div>
            <div v-if="props.row.core != null">
              <el-form-item label="核"><span>{{ props.row.core }}</span></el-form-item>
            </div>
            <div v-if="props.row.activation != null">
              <el-form-item label="激活函数"><span>{{ props.row.activation }}</span></el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="验证ID" prop="verifyId" />
      <el-table-column label="验证工具" prop="tool" />
      <el-table-column label="开始时间" prop="startTime" :formatter="StartTimeFormat" />
      <!--      <el-table-column label="开始时间-server" prop="startTime"></el-table-column>-->
      <el-table-column label="当前状态" prop="status" />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template #default="scope">
          <el-button type="text" size="small" @click="checkResult(scope.row)">查看结果</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'HistoryDeepcert',
  data() {
    return {
      recordTableData: []
    }
  },
  mounted: function() {
    this.GetRecord()
  },
  methods: {
    GetRecord() {
      this.$axios
        .get('/user/' + this.$store.getters.userId + '/history/deepcert')
        .then((res) => {
          this.recordTableData = res.data.data.history
          var i
          for (i = 0; i < this.recordTableData.length; i++) {
            var r = this.recordTableData[i]
            if (r.status === 'error') {
              r.status = '错误'
            }
            if (r.status === 'success') {
              r.status = '成功'
            }
            if (r.status === 'running') {
              r.status = '运行中'
            }
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    checkResult(row) {
      if (row.status === '运行中') {
        this.$alert('验证正在运行，不能查看结果。请稍等并刷新页面重试。', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
          }
        })
        return
      }
      if (row.tool === 'WiNR') {
        this.$router.replace({
          path: '/WiNR/Step3',
          query: { verifyId: row.verifyId }
        })
      } else if (row.tool === 'DeepCert') {
        this.$router.replace({
          path: '/DeepCert/show',
          query: { verifyId: row.verifyId }
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      var re = ''
      if (row.status === '错误') {
        re = 'failure-row'
      }
      if (row.status === '成功') {
        re = 'success-row'
      }
      if (row.status === '运行中') {
        re = 'running-row'
      }
      return re
    },
    StartTimeFormat(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style>
.el-table .failure-row {
  background: lightpink;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .running-row {
  background: oldlace;
}
</style>
