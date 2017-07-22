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
        action: 'activiti/api/define/list',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        this.optionPresets = res.data.data.list
        console.log(this.optionPresets)
      })
    }
  }
}
