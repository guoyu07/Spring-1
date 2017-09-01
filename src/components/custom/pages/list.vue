<style scoped>
  .btn-area {
    margin-bottom: 12px;
  }

  .mgb12 {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="processes wrapper">
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
          <div class="btn-area clear">
            <el-button type="info" :plain="true" @click="onNewBpmn" icon="plus">新建流程 BPMN</el-button>
          </div>

          <draggable v-model="orderedProcesses" @end="onDragEnd" class="draggable">
            <div v-for="(item, index) in orderedProcesses" class="draggable-item">
              <input type="checkbox" :id="index" :disabled="!item.list.length" :checked="item.list.length">
              <label :for="index" class="draggable-item__label">
                <span>
                  <b>{{item.name}}</b> - ({{item.list.length}})
                </span>
                <span class="el-icon-edit text-info" @click="onEditCategoryName(item.id)"></span>
              </label>
              <section>
                <div class="draggable-item__inner">
                  <process-table
                    :item="item"
                    :categories="categoryList"
                    @should-update-categories="getCategoryList"
                    @should-update-processes="getOrderedProcesses"
                    @on-edit-script="onEditScript"
                    @on-cancel-edit="onCancelEdit"></process-table>
                </div>
              </section>
            </div>
          </draggable>
        </el-card>
      </el-col>
    </el-row>
    <script-editor :editor-props="editorProps"></script-editor>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import scriptEditor from './../../_plugins/_scriptEditor'
  import processTable from './_plugins/_processTable'

  export default {
    data () {
      return {
        orderedProcesses: [],
        orderedProcessesBuffer: '',
        editorProps: {
          visible: false,
          pkey: '',
          data: ''
        },
        categoryList: [],
        orderConfVisible: false
      }
    },

    computed: {
      editingFields () {
        return this.$store.state.editingProcesses
      }
    },

    created () {
      this.getOrderedProcesses()
      this.$store.dispatch('store_processes', { editingFields: [] })
    },

    methods: {
      getOrderedProcesses () {
        let postData = {
          action: 'process/category',
          method: 'GET',
          data: {
            include_pds: true,
            pd_detail: true
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.orderedProcesses = res.data.data.list
            this.orderedProcessesBuffer = JSON.stringify(this.orderedProcesses)
            this._onRestoreEditing()
          }
        })
      },

      onDragEnd () {
        const order = this.orderedProcesses.map(_ => _.name)
        let postData = {
          action: 'process/category',
          method: 'PUT',
          data: {
            name_list: order
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已更新分类排序！')
          }
        })
      },

      onEditCategoryName (id) {
        this.$prompt('修改分类名称：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          let postData = {
            action: 'process/category',
            method: 'PUT',
            data: {
              id,
              name: value
            }
          }
          this.http.post('/activiti/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已改名！')
              this.getOrderedProcesses()
            }
          })
        })
      },

      onNewBpmn () {
        window.localStorage.removeItem('bpmn')
        this.$router.replace('/custom/new')
      },

      getCategoryList () {
        let postData = {
          action: 'process/category',
          method: 'get',
          data: {}
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.categoryList = res.data.data.list
          }
        })
      },

      onEditCategory (process) {
        let { category, pkey } = process
        let postData = {
          action: 'process/define',
          method: 'put',
          data: {
            category,
            pkey
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已修改！')
            this.getOrderedProcesses()
          }
        })
      },

      onCancelEdit (editing) {
        this.orderedProcesses = JSON.parse(this.orderedProcessesBuffer)
        editing = false
        this._onRestoreEditing()
      },

      onEditScript (args) {
        let postData = {
          action: 'process/script',
          method: 'GET',
          data: { pkey: args.pkey }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editorProps = { visible: true, pkey: args.pkey, data: res.data.data }
          }
        })
      },

      _onRestoreEditing () {
        if (this.editingFields) {
          this.orderedProcesses.forEach((category) => {
            category.list.forEach((item) => {
              if (this.editingFields.includes(item.pkey)) {
                item.editing = true
              }
            })
          })
        } else {
          return
        }
      }
    },

    components: {
      draggable,
      scriptEditor,
      processTable
    }
  }
</script>
