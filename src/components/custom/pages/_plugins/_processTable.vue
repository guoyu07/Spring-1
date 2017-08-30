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
  </el-table>
</template>

<script>
  const EDITING_FIELDS = 'editingFields'

  export default {
    props: {
      item: Object,
      categories: Array
    },

    computed: {
      processes () {
        return this.item.list
      }
    },

    methods: {
      onEditScript (pkey) {
        this.$emit('on-edit-script', { pkey })
      },

      onAttemptToEdit (process) {
        this.$set(process, 'editing', true)
        this._storeEditing(process.pkey)
        this.$nextTick(() => {
          this.$emit('should-update-categories')
        })
        // process.editing = true
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
            // this.$set(process, 'editing', false)
            this._removeStoredEditing(pkey)
            this.$nextTick(() => {
              this.$emit('should-update-processes')
            })
          }
        })
      },

      _storeEditing (pkey) {
        let editingFields = window.localStorage[EDITING_FIELDS] ? JSON.parse(window.localStorage[EDITING_FIELDS]) : []
        if (!editingFields[pkey]) {
          editingFields.push(pkey)
        }
        window.localStorage.setItem(EDITING_FIELDS, JSON.stringify(editingFields))
      },

      _removeStoredEditing (pkey) {
        let editingFields = window.localStorage[EDITING_FIELDS] ? JSON.parse(window.localStorage[EDITING_FIELDS]) : []
        window.localStorage.setItem(EDITING_FIELDS, JSON.stringify(editingFields.filter(item => item !== pkey)))
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