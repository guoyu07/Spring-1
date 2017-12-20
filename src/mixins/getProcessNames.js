export default {
  created () {
    this.getNavCategory()
  },

  methods: {
    getNavCategory () {
      let postData = {
        action: 'process/names',
        method: 'GET',
        data: {
          group: true
        }
      }
      this.http.post('/api/base/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          // this.categories = res.data.data.list
          this.$store.dispatch('store_process_names', {
            processNames: res.data.data.list
          })
        }
      })
    }
  }
}
