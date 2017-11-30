<style lang="less" scoped>
  @height: 240px; @width: 280px;

  #canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #1a252f;
  }

  .login-warp {
    width: @width;
    height: @height;
    margin: -@height * 0.5 0 0 -@width * 0.5;
    position: absolute;
    left: 50%;
    top: 50%;

    .el-row {
      margin-bottom: 20px;
    }

    .login-btn {
      width: 100%;
      font-weight: bold;
    }

    .el-input {
      width: 100%;
    }
  }

  h2 {
    font-weight: normal;
    font-size: 36px;
    margin-bottom: 28px;
    color: #fff;
    text-align: center;

    b {
      font-weight: bold;
    }
  }
</style>

<template>
  <div id="canvas">
    <transition name="zoomInDown">
      <div class="login-warp">
        <el-row>
          <h2><b>EasyOps</b><br>
          IT 服务中心</h2>
        </el-row>
        <el-form>
          <el-row>
            <el-col :span="24">
              <el-input id="userId" :autofocus="autoFocus" @keyup.enter.native="submit(0)" placeholder="请输入用户名" icon="fa-user-o" auto-complete="off" v-model="credentials.username" ref="username"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-input @keyup.enter.native="submit" placeholder="请输入密码" type="password" icon="fa-lock" auto-complete="off" v-model="credentials.password" id="password"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button class="fw login-btn" type="primary" icon="fa-send" @click="submit(1)">登 录</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
  import auth from '../auth'
  import ParticleNetwork from '../assets/js/particleNetwork'

  const options = {
    particleColor: '#888',
    needBackground: false,
    interactive: true,
    speed: 'slow',
    density: 'low'
  }

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        autoFocus: true,
        error: ''
      }
    },

    watch: {
      '$route' (to, from) {
        console.log(to, from)
        console.log(this.$refs.username.autofocus)
        this.$refs.username.autofocus = true
      }
    },

    methods: {
       // 接受一个索引，最后一个发请求否则跳转下一个
      submit (index) {
        let inputContainer = document.getElementsByTagName('input')
        if (index) {
          const credentials = {
            action: 'login',
            method: 'POST',
            data: {
              userId: this.credentials.username,
              password: this.credentials.password
            }
          }
          // 传入组件的上下文、验证信息及跳转目地
          // 以便 auth.login 发起登录请求
          auth.login(this, credentials, '/menu')
        } else {
          inputContainer[index + 1].focus()
        }
      }
    },
    created () {
      console.log(this)
      delete this.$options.sockets
      console.log(this.$socket)
    },
    mounted () {
      this.$nextTick(() => {
        const canvas = document.getElementById('canvas')
        new ParticleNetwork(canvas, options)
      })
    }
  }
</script>
