<template>
  <div class="left">
    <h1>已有时长</h1>
    <p>{{ time }} 小时</p>
  </div>
</template>
<script>
  export default {
    computed: {
      time () {
        return this.$store.state.totalTime
      }
    }
  }
</script>
<style scoped>
  .left {
    background-color: #f3f8fd;
    padding: 30px 0;
    text-align: center;
    font-size: 24px;
  }
  h1 {
    padding-bottom: 10px;
    border-bottom: 1px solid #6485a7;
  }
</style>
