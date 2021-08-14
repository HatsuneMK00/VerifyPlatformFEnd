<template>
  <div class="dashboard-container">
    <div class="greeting-text">您好，{{ name }}。</div>
    <div class="title1">AI验证系统</div>
    <div class="subtitle1">华东师范大学 可信智能软件实验室</div>
    <div class="title2">简介</div>
    <div class="introduction">阿巴阿巴阿巴aaabbb</div>
    <div class="title2">验证工具</div>
    <div class="introduction">
      目前我们的工具有验证神经网络是否满足鲁棒性的WiNR和快速计算给定神经网络鲁棒半径的DeepCert两款。
      <br/><br/>
    </div>
    <div align="center">
      <el-row>
        <el-button type="warning" plain @click="use_winr">WiNR</el-button>
        <el-button type="warning" plain @click="use_deepcert">DeepCert</el-button>
      </el-row>
    </div>
    <div class="title2">研究发表</div>
    <div class="introduction">阿巴阿巴阿巴aaabbb</div>
    <div class="title2">参考资料</div>
    <div class="introduction">阿巴阿巴阿巴aaabbb</div>
    <div class="title2">联系我们</div>
<!--    <div align="center">-->
<!--      <img :src="groupPhoto" width="350px" height="260px">-->
<!--    </div>-->
    <div class="introduction">邮箱：@@@@@</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'userId'
    ]),
    onWebSocketMessage() {
      return this.$store.getters.message
    }
  },
  watch: {
    onWebSocketMessage: function(message) {
      console.log('receive new message' + message)
    }
  },
  created() {
    console.log('userId is ' + this.$store.getters.userId)
  },
  data() {
    return {
      groupPhoto: require('@/assets/photo/group_photo5.jpg')
    }
  },
  methods: {
    use_winr() {
      this.$router.replace({ path: '/WiNR/index' })
    },
    use_deepcert() {
      this.$router.replace({ path: '/DeepCert/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.greeting-text {
  font-family: Arial, "宋体";
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  background: rgba(90, 110, 240, 0.4);
}

.title1 {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: Arial, "黑体";
  padding: 3px;
  width: 100%;
}

.subtitle1 {
  position: relative;
  text-align: center;
  font-size: 16px;
  font-family: "黑体";
  padding: 3px;
  width: 100%;
}

.title2 {
  text-align: center;
  font-size: 18px;
  font-family: "微软雅黑";
  padding: 18px;
  width: 100%;
}

.introduction {
  font-family: "Times New Roman", "宋体";
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  //background: rgba(55, 85, 239, 0.25);
}
.introduction2 {
  font-family: "Times New Roman", "宋体";
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  //background: rgba(45, 57, 120, 0.2);
}
</style>
