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
        action: 'group',
        method: 'GET',
        data: {}
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.roleList = res.data.data.list
          console.log('mixin working')
        }
      })
    }
  }
}
