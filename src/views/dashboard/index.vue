<template>
  <div class="dashboard-container">
    <div class="greeting-text">您好，{{ name }}。</div>
    <div class="title1">面向自动驾驶的神经网络验证平台</div>
    <div class="subtitle1">华东师范大学 可信智能软件实验室</div>
    <div class="title2">简介</div>
    <div align="center">
      <img class="toolkit_frame" style="height: 152px; width: 283px;"
           src="../../assets/flow_chart/toolkit_framework.png"
      >
    </div>
    <div class="introduction">
      本平台实现了两种求解深度神经网络鲁棒问题的方法，将其应用到自动驾驶情景中，并将队伍成员提出的验证方法首次拓展至神经网络识别路标与交通信号场景。在用训练好的神经网络识别带有交通信号图片并做出正确决策的基础上，平台可以使用两个不同模块来对人工智能技术提供安全保障。
    </div>
    <div class="bg">
      <div class="title2">验证工具</div>
      <div class="bg2">
        <div class="tool-title">
          WiNR
        </div>
        <!--      <div align="center">-->
        <!--        <img class="winr_flowchart" alt style="height: 463px; width: 433px;" src="../../assets/flow_chart/WiNR_FlowChart210815.png">-->
        <!--      </div>-->
        <div class="tool-introduction">
          WiNR是第一个健壮性验证工具，该工具可以采用非ReLU激活函数的各种神经网络架构生成对抗性示例。此外也是第一个将误报作为稳健性验证评估标准之一的工具。WiNR支持广泛的非ReLU神经网络架构，包括CNN、LeNet和ResNet，并在在各种基准上进行训练，包括MNIST、CIFAR10等。
        </div>
        <div align="center">
          <el-button type="primary" size="mini" plain @click="use_winr">使用WiNR</el-button>
        </div>
      </div>
      <div class="bg2">
        <div class="tool-title">
          DeepCert
        </div>
        <!--    <div align="center">-->
        <!--      <img class="deepcert_flowchart" alt style="height: 433px; width: 359px;" src="../../assets/flow_chart/DeepCert_FlowChart210815.png">-->
        <!--    </div>-->
        <div class="tool-introduction">
          DeepCert是对基于线性近似的鲁棒性验证方法的延续，创新地提出了一种对一般激活函数的细粒度线性近似方法，用于计算卷积神经网络更大的鲁棒性下界。该方法计算复杂度较低，适用于使用较紧的上下界和下界来逼近类sigmoid函数。在具有不同激活函数的各种神经网络上的我们在最先进的鲁棒性下界认证工具CNN-Cert的框架基础上实现了DeepCert验证工具。
        </div>
        <div align="center">
          <el-button type="primary" size="mini" plain @click="use_deepcert">使用DeepCert</el-button>
          <h2></h2>
        </div>
      </div>
    </div>
    <!--    <div class="title2">研究发表</div>-->
    <!--    <div class="introduction">阿巴阿巴阿巴aaabbb</div>-->
    <!--    <div class="title2">参考资料</div>-->
    <!--    <div class="introduction">阿巴阿巴阿巴aaabbb</div>-->
    <div class="title2">联系我们</div>
    <div class="introduction">欢迎对我们的平台提出意见或建议，可以通过邮箱10175101106@stu.ecnu.edu.cn联系我们。</div>
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
  font-family: Arial, "微软雅黑";
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  background: rgba(90, 110, 240, 0.4);
}

.title1 {
  position: relative;
  text-align: center;
  font-size: 30px;
  font-family: Arial, "微软雅黑 Light";
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
  font-size: 20px;
  font-family: "华文细黑";
  padding: 5px;
  width: 100%;
}

.introduction {
  font-family: "Times New Roman", "华文细黑";
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  margin: 10px 150px;
  margin-top: 10px;
  margin-right: 150px;
  margin-bottom: 10px;
  margin-left: 150px;
  //background: rgba(55, 85, 239, 0.25);
}

.tool-title {
  position: relative;
  text-align: center;
  font-size: 18px;
  font-family: "华文细黑";
  padding: 3px;
  width: 100%;
  //background: rgba(90, 110, 240, 0.4);
}

.tool-introduction {
  font-family: "Times New Roman", "华文细黑";
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  margin: 10px 150px;
  margin-top: 10px;
  margin-right: 150px;
  margin-bottom: 10px;
  margin-left: 150px;
  //background: rgba(45, 57, 120, 0.2);
}

.bg {
  background: rgba(90, 110, 240, 0.4);
}

.bg2 {
  margin: 10px 150px;
  background: rgba(255, 255, 255, 0.4);
}
</style>
