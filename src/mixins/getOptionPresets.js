// 获取选项预设集
export default {
  data () {
    return {
      optionPresets: []
    }
  },

  methods: {
    getOptionPresets () {
      let postData = {
        action: 'api/source',
        method: 'GET',
        data: {}
      }
      this.http.post('/form/', this.parseData(postData)).then((res) => {
        this.optionPresets = res.data.data.list
        console.log(this.optionPresets)
      })
    }
  }
}
