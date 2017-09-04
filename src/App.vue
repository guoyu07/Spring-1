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
        this.$socket.send('meh')
        // this.$options.sockets.onmessage = (data) => console.log(data)
        this.$socket.onmessage = (data) => {
          console.log('hahaha')
          // console.log(data)
          const message = JSON.parse(data)
          this.$store.dispatch('socket_onmessage', message)
          // if (message.type === 'message' || message.data.type === 'tip') {
          //   console.log('should notify')
          //   this.$notify.info({
          //     title: '新消息',
          //     message: message.data.title
          //   })
          // }
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
