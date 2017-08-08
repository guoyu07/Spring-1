// 获取预设集
export default {
  data () {
    return {
      presetList: []
    }
  },

  methods: {
    getPresetList () {
      let postData = {
        action: 'cmdb/object/list',
        method: 'GET',
        data: {}
      }
      this.http.post('/easyops/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.presetList = res.data.data.list
        }
      })
    }
  }
}
