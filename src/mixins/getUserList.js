export default {
  data () {
    return {
      userList: []
    }
  },

  methods: {
    getUserList () {
      let postData = {
        action: 'permission/users',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.userList = res.data.data
          console.log('mixin working')
        }
      })
    }
  }
}
