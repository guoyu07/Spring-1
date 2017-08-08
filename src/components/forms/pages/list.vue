<style lang="less">
  .process-select {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="list-content">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <h3><i class="el-icon-fa-wpforms icon-lg color-primary"></i> 表单配置</h3>
          <el-select v-model="selectedProcess" placeholder="请先选择流程…" @change="getFormList" class="process-select">
            <el-option
              v-for="process in processList"
              :label="process.pname"
              :value="process.pkey">
            </el-option>
          </el-select>
          <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small>
          <el-table
            :data="formList"
            border
            v-loading.body="formListLoading">
            <el-table-column
              label="任务名称"
              prop="tname"></el-table-column>
            <el-table-column
              label="操作"
              width="240"
              inline-template
              :context="_self">
              <template>
                <el-button size="small" @click="onEdit(row)" icon="fa-cogs">自定义</el-button>
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
import getProcessList from './../../../mixins/getProcessList'

export default {
  mixins: [getProcessList],

  data () {
    return {
      selectedProcess: '',
      formList: [],
      formListLoading: false
    }
  },

  created () {
    this.getProcessList()
    this.selectedProcess && this.getFormList(this.selectedProcess)
  },

  methods: {
    // 根据所选流程 pkey 获取流程下表单
    getFormList (pkey) {
      const postData = {
        action: 'process/form', // activiti/task/form
        method: 'GET',
        data: { pkey, tkey: 'start' } // TODO: 这里加多一个 tkey 参数，应该填什么值？？暂时填了 start
      }
      this.formListLoading = true
      this.http.post('/form/', this.parseData(postData)).then((res) => {
        this.formList = res.data.data.list
        this.formListLoading = false
      })
    },

    onEdit (row) {
      row.pkey = this.selectedProcess
      console.log(row)
      this.$router.push({ path: '/forms/editor', query: { row } })
    }
  }
}
</script>
