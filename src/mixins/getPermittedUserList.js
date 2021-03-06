// 获取用户列表
export default {
  data () {
    return {
      permittedUserList: []
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
          this.permittedUserList = res.data.data.list
          console.log('mixin working')
        }
      })
    }
  }
}
