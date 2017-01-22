<template>
  <div class="home">
    <header-warp></header-warp>
    <side-warp></side-warp>
    <div id="content">
      <router-view></router-view>
    </div>
    <footer-warp></footer-warp>
  </div>
</template>
<script>
  import HeaderWarp from './layout/Header'
  import SideWarp from './layout/SideBar'
  import FooterWarp from './layout/Footer'

  export default {
    data () {
      return {
        dynamicForm: {
          domains: [{
            value: ''
          }],
          email: ''
        },
        dynamicRule: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        }
      }
    },
    methods: {
      handleSubmit3 (ev) {
        console.log(this.$refs.dynamicForm.fields['domains.0.value'].fieldValue)
        // this.$refs.dynamicForm.validate((valid) => {
        //   if (valid) {
        //     console.log('submit!')
        //   } else {
        //     console.log('error submit!!')
        //     return false;
        //   }
        // })
      },
      handleReset3 () {
        this.$refs.dynamicForm.resetFields()
      },
      removeDomain (item) {
        var index = this.dynamicForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicForm.domains.splice(index, 1)
        }
      },
      addDomain () {
        this.dynamicForm.domains.push({
          value: '',
          key: Date.now()
        })
      }
    },
    components: {
      HeaderWarp,
      SideWarp,
      FooterWarp
    }
  }
</script>
<style>
  #content {
    /*width: 100%;*/
    /*height: 100%;*/
    padding-top: 80px;
    padding-left: 200px;
    /*overflow: auto;*/
  }
  .el-menu-item-group__title {
    font-size: 12px;
  }
</style>