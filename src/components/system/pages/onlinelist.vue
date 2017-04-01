<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>上线列表</h3>
          <!-- <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link> -->
          <el-table
            :data="applyList"
            border
            style="width: 100%; min-width: 460px">
            <el-table-column
              prop="applicationName"
              label="应用名"></el-table-column>
            <el-table-column
              prop="applyType"
              label="申请类型"></el-table-column>
            <el-table-column
              prop="business"
              label="项目组"></el-table-column>
            <el-table-column
              prop="name"
              label="当前任务"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <div class="btn-block">
                <router-link v-if="row.name==='填写申请单'" :to="{ path: `/system/online/apply/${row.id}`}" class="el-button el-button--primary el-button--small">填写</router-link>
                <span v-else v-for="action in row.action">
                  <router-link v-if="action.type==='submit'" :to="{ path: `/system/online/${row.taskDefinitionKey}/${row.id}/${row.name}`}" class="el-button el-button--primary el-button--small">审批</router-link>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" size="small" @click="onReject(row, action)">{{action.pass===2?'驳回':'撤单'}}</el-button>
                  <!-- action.pass===1?'驳回':'撤销' -->
                </span>
              </div>
            </el-table-column>
          </el-table>
          <div class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="onPageChange"
              :total="totalFiltered">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getApplyList from './../../../mixins/getApplyList'

  export default {
    mixins: [getApplyList],

    created () {
      this.getApplyList()
    }
  }
</script>
<style lang="less" scoped>
.btn-block {
  padding: 8px 0;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  .el-button {
    margin-right: 5px;
    margin-bottom: 2px;
    margin-top: 2px;
  }
}
.item-block {
  display: inline-block;
  margin-right: 30px;
  padding-right: 20px;
  border-right: 1px dashed #e0e6ed;
  color: #5e6d82;

  &:last-child {
    border-right: none;
  }
}
.margin-bottom {
  margin-bottom: 15px;
}
.margin-left {
  margin-left: 10px;
}
.el-button:hover{
  text-decoration: none;
}
</style>
