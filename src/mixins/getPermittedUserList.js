// 获取用户列表
export default {
  data () {
    return {
      userList: []
    }
  },

  methods: {
    getPermittedUserList () {
      let postData = {
        action: 'user',
        method: 'GET',
        data: {}
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.userList = res.data.data
          console.log('mixin working')
        }
      })
    }
  }
}
