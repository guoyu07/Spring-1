<template>
 <div class="wrapper">
    <el-row>
     <el-col :md="12" :lg="12">
      <h3><i class="el-icon-fa-key"></i> 修改密码</h3>
      <el-form :model='editForm' ref='editForm' :rules='checkPass' label-width="100px" >
	    <el-form-item label="旧密码" prop="old_pass">
	  	 <el-input v-model="editForm.old_pass" type='password'  @keypress.native="capLock($event)">
       </el-input><p v-if="isCap" class="capTip">大写已打开</p>
	    </el-form-item>
	    <el-form-item label="新密码" prop='new_pass'>
	  	 <el-input placeholder="请输入 6 至 20 位密码" v-model="editForm.new_pass" type='password' ></el-input>
	    </el-form-item>
	    <el-form-item label="再次确认密码" prop='confirm_pass'>
	  	 <el-input placeholder="请输入 6 至 20 位密码" v-model="editForm.confirm_pass" type='password'></el-input>
	    </el-form-item>
	    <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
	  </el-form>
     </el-col>
    </el-row>
 </div>
</template>
<style scoped>
  .capTip{
    color: #ff4949;
    font-size: 12px;
    line-height: inherit;
    width:fit-content;
    position: absolute;
    top: 0;
    left: 100%;
  }
</style>
<script>
import auth from '../../../auth'
export default {
  data () {
    var checkLength = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else {
        let reg = /^[a-zA-Z0-9_!@#$%^&*]{6,16}$/
        if (!reg.test(value)) {
          return callback(new Error('请输入6至16位符合规则的密码'))
        } else { callback() }
      }
    }
    var confirmPass = (rule, value, callback) => {
      if (value !== this.editForm.new_pass) {
        return callback(new Error('两次密码不相符'))
      } else { callback() }
    }
    return {
      isCap: false,
      editForm: {
        old_pass: '',
        new_pass: '',
        confirm_pass: ''
      },
      checkPass: {
        old_pass: [{validator: checkLength, trigger: 'blur'}],
        new_pass: [{validator: checkLength, trigger: 'blur'}],
        confirm_pass: [{validator: confirmPass, trigger: 'blur'}]
      }
    }
  },
  methods: {
    capLock (e) {
      console.log(e)
      let kc = e.keyCode || e.which
      let sk = e.shiftkey || (kc === 16)
      if (((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk)) {
        this.isCap = true
      } else { this.isCap = '' }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('success')
          this.postEditForm()
        } else {
          return false
        }
      })
    },
    postEditForm () {
      let postData = {
        action: 'user/password',
        method: 'put',
        data: {
          old_password: this.editForm.old_pass,
          new_password: this.editForm.new_pass
        }
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.$message({message: '修改成功', type: 'success', duration: '800'})
          setTimeout(() => auth.logout(), 1200)
        }
      })
    }
  }
}
</script>
