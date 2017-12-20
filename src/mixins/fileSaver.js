export default {
  methods: {
    // _base64ToArrayBuffer (base64) {
    //   // console.log(base64)
    //   let binaryString = window.atob(base64)
    //   let binaryLen = binaryString.length
    //   let bytes = new Uint8Array(binaryLen)
    //   for (let i = 0; i < binaryLen; i++) {
    //     let ascii = binaryString.charCodeAt(i)
    //     bytes[i] = ascii
    //   }
    //   return bytes
    // },

    // _saveByteArray (data, name) {
    //   let a = document.createElement('a')
    //   document.body.appendChild(a)
    //   a.style = 'display: none'

    //   let blob = new window.Blob(data, { type: 'octet/stream' })
    //   let url = window.URL.createObjectURL(blob)

    //   a.href = url
    //   a.download = name
    //   a.click()
    //   window.URL.revokeObjectURL(url)
    // }
    downloadTempFile (action, { pkey, timeQuery, userId }) {
      let postData = {
        action,
        method: 'GET',
        data: { time_query: timeQuery, userId, pkey }
      }
      this.http.post('/report/', this.parseData(postData)).then((res) => {
        // let fileName =
        // let postData = {
        //   action: 'download',
        //   file_name: res.data.data.file_name
        // }
        let a = document.createElement('a')
        a.href = `/api/data/?action=download&file_name=${res.data.data.file_name}`
        a.download = 'test.xls'
        document.body.appendChild(a)
        a.click()
      })
    }
  }
}
