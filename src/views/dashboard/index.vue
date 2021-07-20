<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}, userId: {{ userId }}</div>
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
      return this.$store.getters.message;
    }
  },
  watch: {
    onWebSocketMessage: function (message) {
      console.log("receive new message" + message)
    }
  },
  created() {
    console.log("userId is " + this.$store.getters.userId)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
