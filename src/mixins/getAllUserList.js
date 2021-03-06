// 获取用户列表
export default {
  data () {
    return {
      userList: []
    }
  },

  methods: {
    getAllUserList () {
      let postData = {
        action: 'users/all',
        method: 'GET',
        data: {}
      }
      this.http.post('/base/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.userList = res.data.data.list
          console.log('mixin working')
        }
      })
    }
  }
}
