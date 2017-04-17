<style lang="less">
  .el-dialog {
    .CodeMirror {
      font-size: 12px;
      height: 420px;
    }

    .editor-title {
      margin-top: 0;
      margin-bottom: 12px;
    }
  }
</style>

<template>
  <el-dialog title="编辑后置脚本" v-model="editorProps.visible" size="large" top="8%">
    <h5 class="editor-title"><i class="el-icon-information"></i> 在下方的编辑器里编辑后置脚本（.py）：</h5>
    <codemirror v-model="editorProps.data" :options="editorOptions"></codemirror>

    <div class="dialog-footer" slot="footer">
      <el-button @click="onSubmit" type="success" icon="check">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { codemirror } from 'vue-codemirror'

  export default {
    props: {
      editorProps: Object
    },

    data () {
      return {
        editorOptions: {
          tabSize: 4,
          mode: 'text/x-python',
          theme: 'solarized light',
          autoCloseBrackets: true,
          lineNumbers: 4
        }
      }
    },

    computed: {
      editor () {
        return this.$refs.myEditor.editor
      }
    },

    methods: {

      onSubmit () {
        let { pkey, data } = this.editorProps
        let postData = {
          action: 'process/custom/script',
          method: 'POST',
          data: { pkey, data }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editorProps.visible = false
            this.$message.success('编辑后置脚本成功！')
          }
        })
      }
    },

    components: {
      codemirror
    }
  }
</script>