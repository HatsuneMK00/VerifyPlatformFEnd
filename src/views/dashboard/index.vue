<template>
  <div class="dashboard-container">
    <div class="greeting-text">您好，{{ name }}。</div>
    <div class="title1">AI验证系统</div>
    <div class="subtitle1">华东师范大学 可信智能软件实验室</div>
    <div class="title2">简介</div>
    <div class="introduction">阿巴阿巴阿巴aaabbb</div>
    <div class="title2">开发人员及联系方式</div>
    <div align="center">
      <img :src="groupPhoto" width="350px" height="260px">
    </div>
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
      groupPhoto: require('@/assets/photo/group_photo01.jpg')
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
}
</style>
