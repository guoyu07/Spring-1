<template>
  <div>
<!-- 	  <el-upload
	    v-show="upload"
	    action="/api/upload_file/"
	    accept=".xls,.xlsx"
	    :on-success="onUploadExcel"
	    :file-list="excelList"
	    class="margin-bottom">
	    <el-button icon="fa-file-excel-o" type="primary">{{upload.name}}</el-button>
	    <div class="el-upload__tip" slot="tip">只能上传 Excel 文档</div>
	  </el-upload> -->
	  <a v-if="download" class="el-button el-button--info is-plain" :href="'/api/data/?action='+download.action" target="_blank"><i class="el-icon-fa-download"></i> {{download.name}}</a>
  </div>
</template>
<script>
  export default {
    props: {
      download: {},
      upload: {}
    },

    data () {
      return {
        excelList: []
      }
    },

    method: {
      excelFileChange (file, fileList) {
        this.excelList = fileList.slice(-1)
      },
      onUploadExcel (res, file, fileList) {
        console.log(res)
        let postData = {
          action: 'import_server',
          method: 'POST',
          data: { file_name: res.data[0].file_name }
        }
        this.http.post('/api/data/', postData).then((res) => {
          if (res.status === 200) {
            console.log(res.data.data)
            // this.postForm.body = res.data.data.body
            this.$emit('fill-form', res.data.data.body)
            // setTimeout(() => {
            //   // this.postForm.body = this.postForm.body.map((body, bodyindex) => {
            //   //   return Object.assign({}, body, res.data.data.body[bodyindex])
            //   // })
            // }, 100)
            // this.$refs['postForm'].validate((valid) => {
            //   if (valid) {
            //     // this.$message.success('成功')
            //   } else {
            //     this.$message.info('请补充完整当前表单')
            //   }
            // })
            // this.tabsValue = '0'
          }
        })
      }
    }
  }
</script>
<style>
	
</style>