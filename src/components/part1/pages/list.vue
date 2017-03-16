<style lang="less">
  .process-select {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="list-content">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-cogs"></i> 自定义表单</h3>
          <el-select v-model="selectedProcess" placeholder="请选择流程…" @change="getFormList" class="process-select">
            <el-option
              v-for="process in processList"
              :label="process.pname"
              :value="process.pkey">
            </el-option>
          </el-select>
          <el-table
            :data="formList"
            border
            v-loading.body="formListLoading">
            <el-table-column
              label="任务名称"
              prop="tname"></el-table-column>
            <el-table-column
              label="操作"
              width="240">
              <template scope="scope">
                <el-button size="small" icon="edit" @click="onEdit(scope.row)">修改</el-button>
                <el-button size="small" icon="delete" type="danger" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { DEL_CONF } from '../../../store/mutation-types'

export default {
  data () {
    return {
      selectedProcess: '',
      processList: [],
      formList: [],
      formListLoading: false
    }
  },
  created () {
    this.getProcessList()
  },
  activated () {
    this.selectedProcess && this.getFormList(this.selectedProcess)
  },
  methods: {
    // 获取所有流程，
    // 供选择框用
    getProcessList () {
      const postData = {
        action: 'activiti/process/definition',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        this.processList = res.data.data.list
      })
    },

    // 根据所选流程 pkey 获取流程下表单
    getFormList (pkey) {
      const postData = {
        action: 'activiti/task/form',
        method: 'GET',
        data: { pkey }
      }
      this.formListLoading = true
      this.http.post('', this.parseData(postData)).then((res) => {
        this.formList = res.data.data.list
        this.formListLoading = false
      })
    },

    newTaskBtn () {
      this.$router.push('/part1/editor')
    },

    onEdit (row) {
      row.pkey = this.selectedProcess
      this.$router.push({ path: '/part1/editor', query: { row } })
    },

    onDelete (id) {
      // this.$store.commit(DEL_CONF, id)
    }
  }
}
</script>
