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
