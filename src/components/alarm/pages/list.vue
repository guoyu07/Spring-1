<template>
  <div class="list">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <h3><i class="el-icon-fa-bullhorn icon-lg"></i> 告警事件</h3>
          <el-table
            :data="formList"
            border
            v-loading:body="formListLoading">
            <el-table-column
              label="告警对象"
              prop="object"></el-table-column>
            <el-table-column
              label="告警等级"
              prop="level"></el-table-column>
            <el-table-column
              label="影响范围"
              prop="range"></el-table-column>
            <el-table-column
              label="通知人"
              prop="target"></el-table-column>
            <el-table-column
              label="告警状态"
              prop="status"></el-table-column>
            <el-table-column
              label="告警时间"
              prop="time"></el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="120">
              <template scope="scope">
                <el-button size="small" @click="onHandle(scope.row)" icon="fa-ellipsis-h">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formList: [{
          object: 'xxx',
          level: 2,
          range: 'xxx',
          target: 'xxx',
          status: 'xxx',
          time: '2017-3-4'
        }]
      }
    }
  }
</script>