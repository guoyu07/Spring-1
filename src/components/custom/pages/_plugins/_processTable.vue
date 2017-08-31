<template>
  <el-table
    :data="processes"
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
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat"></el-option>
        </el-select>
        <i v-show="row.editing" class="el-icon-check text-success" @click="onEditCategory(row)"></i>
        <i v-show="row.editing" class="el-icon-close text-error" @click="onCancelEdit(row)"></i>
        <span v-show="!row.editing">{{row.category}}</span>
        <i class="el-icon-edit text-info" v-show="!row.editing" @click="onAttemptToEdit(row)"></i>
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
    <el-table-column
      label=""
      align="center"
      width="60px"
      inline-template
      :context="_self">
      <template>
        <i class="el-icon-fa-arrows text-info"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import Sortable from 'sortablejs'

  export default {
    props: {
      item: Object,
      categories: Array
    },

    data () {
      return {
        sortable: null,
        newList: []
      }
    },

    computed: {
      processes () {
        return this.item.list
      },

      editingFields: {
        get () {
          return this.$store.state.editingProcesses
        },
        set (val) {}
      }
    },

    mounted () {
      this.newList = this.item.list.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },

    methods: {
      setSort () {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
            let order = this.newList.map(item => item.pkey)
            let postData = {
              action: 'process/order',
              method: 'POST',
              data: { pkey_list: order }
            }
            this.http.post('/activiti/', this.parseData(postData)).then((res) => {
              if (res.status === 200) {
                this.$message.success('已更新流程排序！')
              }
            })
          }
        })
      },

      onEditScript (pkey) {
        this.$emit('on-edit-script', { pkey })
      },

      onAttemptToEdit (process) {
        this.$set(process, 'editing', true)
        this._storeEditing(process.pkey)
        this.$nextTick(() => {
          this.$emit('should-update-categories')
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
            this._removeStoredEditing(pkey)
            this.$nextTick(() => {
              this.$emit('should-update-processes')
            })
          }
        })
      },

      _storeEditing (pkey) {
        if (!this.editingFields[pkey]) {
          this.editingFields.push(pkey)
        }
        this.$store.dispatch('store_processes', { editingFields: this.editingFields })
      },

      _removeStoredEditing (pkey) {
        let buffer = this.editingFields.filter(item => item !== pkey)
        this.$store.dispatch('store_processes', { editingFields: buffer })
      },

      onCancelEdit ({ pkey, editing }) {
        editing = false
        this._removeStoredEditing(pkey)
        this.$nextTick(() => {
          this.$emit('on-cancel-edit')
        })
      }
    }
  }
</script>