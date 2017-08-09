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
          <el-select v-model="selectedProcess" placeholder="请先选择流程…" class="process-select">
            <el-option
              v-for="process in processList"
              :label="process.pname"
              :value="process">
            </el-option>
          </el-select>
          <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small>
          <el-table
            :data="selectedProcess && selectedProcess.task_list"
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
                <router-link :to="{ path:'/forms/editor/', query: { pkey:  selectedProcess.pkey, tkey: row.tkey, tname: row.tname }}">
                  <el-button size="small" icon="fa-cogs">自定义</el-button>
                </router-link>
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
      selectedProcess: null,
      formList: [],
      formListLoading: false
    }
  },

  created () {
    this.getProcessList()
  },

  methods: {
  }
}
</script>
