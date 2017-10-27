<template>
 <div class="wrapper">
    <el-row>
      <el-col :sm="24" :md="20">
        <el-card>
          <h3><i class="el-icon-fa-info-circle icon-lg"></i> 设置基本信息</h3>
          <el-form class="margin-top" :model='basicsForm' ref='basicsForm' :rules="basicsCheck" label-width="100px">
            <el-form-item label="用户名" >
              <el-input v-model='basicsForm.userId' disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称" >
              <el-input v-model="basicsForm.nick" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="basicsForm.email" ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="basicsForm.phone" ></el-input>
            </el-form-item>
            <el-button type="primary" icon="check" @click="submitForm('basicsForm')">保存</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
 </div>
</template>
<script>
export default {
  data () {
    var phoneCheck = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (value === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          return callback(new Error('请输入正确的手机号'))
        } else { callback() }
      }
    }
    return {
      test: '',
      basicsForm: {
        userId: '',
        nick: '',
        email: '',
        phone: ''
      },
      basicsCheck: {
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }],
        phone: [{validator: phoneCheck, trigger: 'change'}]
      }
    }
  },
  created () {
    this.basicsForm.userId = this.$store.state.userinfo.userId
    this.basicsForm.nick = this.$store.state.userinfo.nick
    this.basicsForm.email = this.$store.state.userinfo.email
    this.basicsForm.phone = this.$store.state.userinfo.phone
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateUserMessage()
        } else {
          return false
        }
      })
    },
    updateUserMessage () {
      let postData = {
        action: 'user',
        method: 'put',
        data: {
          userId: this.basicsForm.userId,
          nick: this.basicsForm.nick,
          email: this.basicsForm.email,
          phone: this.basicsForm.phone
        }
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.$message({message: '修改成功', type: 'success', duration: '1000'})
          this.$store.dispatch('update_userinfo', {
            userinfo: res.data.data
          })
        }
      })
    }
  }
}
</script>
