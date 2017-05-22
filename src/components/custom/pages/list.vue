<style scoped>
  .btn-area {
    margin-bottom: 12px;
  }

  .mgb12 {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程设计</h3>
          <el-alert
            title="在此修改流程的 BPMN（业务流程建模标记），以自定义流程的环节和走向 :)"
            type="info"
            show-icon
            class="mgb12">
          </el-alert>
          <!-- <div class="btn-area clear">
            <el-button type="info" :plain="true" @click="onNewBpmn" icon="plus">新建流程 BPMN</el-button>
          </div> -->
          <el-table
            :data="permittedProcessList"
            border>
            <el-table-column
              prop="pname"
              label="流程名称"></el-table-column>
            <el-table-column
              prop="category"
              label="类别"></el-table-column>
            <el-table-column
              label="操作"
              inline-template
              :context="_self">
              <template>
                <el-button type="info" size="small" :plain="true" @click="$router.replace(`/custom/bpmn/${row.pkey}`)" icon="fa-cogs">自定义</el-button>
                <el-button type="info" size="small" :plain="true" @click="onEditScript(row.pkey)" icon="fa-code">后置脚本</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <script-editor :editor-props="editorProps"></script-editor>
  </div>
</template>

<script>
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'
  import scriptEditor from './../../_plugins/_scriptEditor'

  export default {
    mixins: [getPermittedProcessList],

    data () {
      return {
        editorProps: {
          visible: false,
          pkey: '',
          data: ''
        }
      }
    },

    created () {
      this.getPermittedProcessList()
    },

    methods: {
      onNewBpmn () {
        window.localStorage.removeItem('bpmn')
        this.$router.replace('/custom/new')
      },

      onEditScript (pkey) {
        let postData = {
          action: 'process/custom/script',
          method: 'GET',
          data: { pkey }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editorProps = { visible: true, pkey, data: res.data.data }
          }
        })
      }
    },

    components: {
      scriptEditor
    }
  }
</script>
