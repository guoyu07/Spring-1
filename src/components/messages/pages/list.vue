<template>
  <div class="wrapper">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <h3><i class="el-icon-fa-bell icon-lg"></i> 消息管理</h3>
          <el-table :data="messageList" stripe v-loading="loading">
            <el-table-column type="expand">
              <template scope="props">
                <h5 class="sub-title">
                  <i class="el-icon-fa-bell-o"></i> 消息详情：
                </h5>
                <router-link class="text-info" :to="{ path: props.row.url }">{{ props.row.content }}</router-link>
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              prop="title"></el-table-column>
            <el-table-column
              label="创建时间"
              prop="ctime"
              width="200px"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              width="50px"
              align="center">
              <template>
                <i v-if="row.read" class="el-icon-fa-envelope-open-o"></i>
                <el-tooltip v-else content="设为已读" placement="top">
                  <i class="el-icon-fa-envelope text-warning havent-read" @click="readMessage(row.id)"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="margin-top margin-bottom fr"
            layout="prev, pager, next"
            :total="pagination.total"
            :current-page="pagination.current"
            :page-size="pagination.pageSize"
            @current-change="onPageChange"></el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        messageList: [],
        // read: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        loading: false
      }
    },

    mounted () {
      this.getMessageList()
    },

    methods: {
      getMessageList () {
        let postData = {
          action: 'message',
          method: 'GET',
          data: {
            page: this.pagination.current,
            page_size: this.pagination.pageSize
          }
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.messageList = res.data.data.list
            this.pagination.total = res.data.data.total
            this.$store.dispatch('socket_onread')
          }
        })
      },

      onPageChange (val) {
        this.pagination.current = val
        this.getMessageList()
      },

      readMessage (id) {
        let postData = {
          action: 'message',
          method: 'POST',
          data: {
            ids: id ? [ id ] : null
          }
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.getMessageList()
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");

  .havent-read {
    cursor: pointer;

    &:hover {
      color: lighten(@warning, 10%)
    }
  }
</style>