<style scoped>
  #app * {
    text-shadow: none !important;
  }
</style>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import socket from './socket'
export default {
  name: 'app',

  mounted () {
    window.onfocus = () => {
      let tag = this.$store.state.socket.connected
      console.log(tag)
      if (!tag) {
        this.$message.error('链接异常请重新刷新')
      }
    }
    this.$nextTick(() => {
      if (socket.socketOpen) {
        this.$socket.onmessage = (data) => {
          const message = JSON.parse(data)
          this.$store.dispatch('socket_onmessage', message)
        }
      }
    })
  }
}
</script>

<style lang="less">
  #app {
    width: 100%;
    height: 100%;
  }
</style>
