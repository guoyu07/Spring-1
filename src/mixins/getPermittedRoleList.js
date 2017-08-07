// 获取角色列表
export default {
  data () {
    return {
      roleList: []
    }
  },

  methods: {
    getPermittedRoleList () {
      let postData = {
        action: 'process/define',
        method: 'GET',
        data: {}
      }
      this.http.post('/activiti/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.roleList = res.data.data
          console.log('mixin working')
        }
      })
    }
  }
}
