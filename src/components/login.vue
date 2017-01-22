<style lang="less" scoped>
  .login-warp {
    display: flex;
    justify-content: center;
    padding-top: 200px;
    // font-family: Microsoft Yahei;
  }
  .el-form {
    border-radius: 10px;
    padding: 10px 30px;
    width: 300px;
    background-color: #f0f0f0;
    text-align: center;
    color: #20a0ff;
    height: auto;
  }
  .btn-block {
    width: 100%;
    border-radius: 20px;
  }
</style>

<template>
  <div class="login-warp">
    <el-form label-width="0">
      <h1>用户登录</h1>
      <el-form-item prop="pass">
        <el-input type="text" v-model="credentials.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input icon="edit" type="password" v-model="credentials.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" class="btn-block">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import auth from '../auth'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      submit () {
        const credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        // 传入组件的上下文、验证信息及跳转目地
        // 以便 auth.login 发起登录请求
        auth.login(this, credentials, '/')
      }
    }
  }
</script>