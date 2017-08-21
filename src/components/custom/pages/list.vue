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
          <div class="btn-area clear">
            <el-button type="info" :plain="true" @click="onNewBpmn" icon="plus">新建流程 BPMN</el-button>
          </div>

          <draggable v-model="orderedProcesses" @end="onDragEnd" class="draggable">
            <div v-for="(item, index) in orderedProcesses" class="draggable-item">
              <input type="checkbox" :id="index">
              <label :for="index" class="draggable-item__label">
                {{item.name}}
              </label>
              <section>
                <div class="draggable-item__inner">
                  <el-table
                    :data="item.list"
                    border>
                    <el-table-column
                      prop="pname"
                      label="流程名称"></el-table-column>
                    <el-table-column
                      label="类别"
                      inline-template
                      :context="_self">
                      <template>
                        <el-select
                          v-show="row.editing"
                          v-model="row.category"
                          size="small"
                          filterable
                          allow-create>
                          <el-option v-for="cat in categoryList" :key="cat" :label="cat" :value="cat"></el-option>
                        </el-select>
                        <i v-show="row.editing" class="el-icon-check text-success" @click="onEditCategory(row)"></i>
                        <i v-show="row.editing" class="el-icon-close text-error" @click="onCancelEdit(row.editing)"></i>
                        <span v-show="!row.editing">{{row.category}}</span>
                        <i class="el-icon-edit text-info" v-show="!row.editing" @click="row.editing = true;getCategoryList()"></i>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      inline-template
                      :context="_self">
                      <template>
                        <router-link :to="{ path: `/custom/bpmn/${row.pkey}` }" class="el-button el-button--small el-button--plain"><i class="el-icon-fa-cogs"></i> 自定义</router-link>
                        <el-button type="info" size="small" :plain="true" @click="onEditScript(row.pkey)" icon="fa-code">后置脚本</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
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

    created () {
      this.getOrderedProcesses()
      // this.getCategoryList()
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
            this.$message.success('已更新排序！')
          }
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

      onEditCategory ({ pkey, category }) {
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
            // this.getPermittedProcessList()
            this.getOrderedProcesses()
          }
        })
      },

      onCancelEdit (editing) {
        this.orderedProcesses = JSON.parse(this.orderedProcessesBuffer)
        editing = false
      },

      onEditScript (pkey) {
        let postData = {
          action: 'process/script',
          method: 'GET',
          data: { pkey }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editorProps = { visible: true, pkey, data: res.data.data }
          }
        })
      }
    },

    components: {
      draggable,
      scriptEditor
    }
  }
</script>
