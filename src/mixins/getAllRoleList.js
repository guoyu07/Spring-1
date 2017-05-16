// 获取用户列表
export default {
  data () {
    return {
      roleList: []
    }
  },

  methods: {
    getAllRoleList () {
      let postData = {
        action: 'groups/all',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.roleList = res.data.data
          console.log('mixin working')
        }
      })
    }
  }
}
