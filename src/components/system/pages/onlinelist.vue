<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>应用上线流程</h3>
          <el-table
            :data="applyList"
            border
            style="width: 100%; min-width: 460px">
            <el-table-column
              v-for="formHeader in form.header"
              :label="formHeader.name">
              <template scope="scope">
                <span v-if="formHeader.value.type === 'FK' || formHeader.value.type === 'dict'">
                  <span v-if="typeof Object.assign({}, scope.row.header)[formHeader.id] === 'object'">
                    {{ Object.assign({}, Object.assign({}, scope.row.header)[formHeader.id])['name'] }}
                  </span>
                  <span v-else>{{ Object.assign({}, scope.row.header)[formHeader.id] }}</span>
                </span>
                <span v-else-if="formHeader.value.type === 'FKs' || formHeader.value.type === 'dicts'">
                  <span v-for="span in Object.assign({}, scope.row.header)[formHeader.id]">{{span.name}}</span>
                </span>
                <span v-else>{{ Object.assign({}, scope.row.header)[formHeader.id] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="当前任务">
              <p>{{row.name}}</p>
            </el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <div class="btn-block">
                <router-link :to="{ path: `/system/online/${row.pkey}/${row.taskDefinitionKey}/${row.id}/${row.name}`}" class="el-button el-button--primary el-button--small">查看详情</router-link>
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
  import getApplyList from './../../../mixins/getOnlineList'

  export default {
    mixins: [getApplyList],

    created () {
      this.getApplyList()
      this.renderTaskForm()
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
