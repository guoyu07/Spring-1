
<template>
  <div>
  </div>
</template>

<script>
  import eventHub from '../utils/event-hub'
  import socket from '../socket'
  import router from '../router'
  import store from '../store'

  export default {
    data () {
      return {
      }
    },

    methods: {
      login (creds, redirect) {
        store.dispatch('update_userinfo', {
          userinfo: creds
        })
         // 跳转至指定目的
        router.replace(redirect)
        socket.initSocket()
          // 发射 login 事件
        eventHub.$emit('login')
      },

      getUserInfo () {
        const postData = {
          action: 'user/info',
          method: 'GET',
          data: {
          }
        }
        this.http.post('/api/user/', this.parseData(postData)).then((res) => {
          console.log(res)
          this.login(res.data.data, '/menu')
        })
      }
    },

    created () {
      this.getUserInfo()
    }
  }
</script>
