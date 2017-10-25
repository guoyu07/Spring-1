<template>
  <div :class="{ 'order-list': true, collapsed: !isExpanded }">
    <el-card class="box-card">
      <h3>
        <i class="el-icon-fa-calendar-o icon-lg"></i> {{filterData.name}}工单
        <el-button class="fr" type="text" icon="edit" style="margin-bottom: 12px" v-show="filterData.can_edit">
          <router-link :to="{ path: `/orders/queues/${orderId}/edit` }">编辑列表</router-link>
        </el-button>
      </h3>
      <div class="order-search">
        <div :class="{ 'order-search--basic': true, 'collapsed': isAdvancedSearch }">
          <el-row :gutter="12">
            <el-col :span="10">
              <el-input placeholder="模糊搜索" v-model="fuzzySearchKey">
                <el-button slot="append" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                type="text"
                icon="fa-angle-down"
                @click="isAdvancedSearch = !isAdvancedSearch">高级搜索</el-button>
            </el-col>
            <el-col :span="6" :offset="4">
              <el-button class="fr" type="text" icon="edit" style="margin-bottom: 12px" v-show="filterData.can_edit">
                <router-link :to="{ path: `/orders/queues/${orderId}/edit` }">编辑列表</router-link>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div :class="{ 'order-search--advanced': true, 'loomed': isAdvancedSearch }">
          <el-row>
            <el-col :span="20">
              <el-form label-position="left" label-width="100px" :inline="true">
                <el-form-item
                  v-for="field in filterData.show"
                  :key="field.key_path"
                  :label="field.label">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" @click="isAdvancedSearch = !isAdvancedSearch">取消</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>

      <div v-if="filteredTasks.list && filteredTasks.list.length">
        <el-table
          :data="filteredTasks.list"
          v-loading="loading"
          width="100%"
          stripe
          border
          >
          <el-table-column
            v-for="(col, colIndex) in filterData.show"
            :key="col.key_path"
            inline-template
            :context="_self"
            :label="col.label">
            <template>
              <span :class="colIndex ? '' : 'link-block'" @click="check(row, colIndex)">
                <span v-if="row.columns.find(c => c.key_path === col.key_path) && Array.isArray(row.columns.find(c => c.key_path === col.key_path).value)">
                  {{row.columns.find(c => c.key_path === col.key_path).value.join('、')}}
                </span>
                <span v-else>{{row.columns.find(c => c.key_path === col.key_path) ? row.columns.find(c => c.key_path === col.key_path).value : ''}}
                </span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="margin-top margin-bottom fr"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="currentSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTasks.total"></el-pagination>
      </div>

      <div v-else class="placeholder-card">
        <i class="el-icon-fa-coffee"></i>
        <h3>你的队列为空，可以喝杯咖啡去！</h3>
      </div>
    </el-card>
  </div>
</template>

<script>
  import getFilteredTasks from './../../../mixins/getFilteredTasks'

  export default {
    mixins: [ getFilteredTasks ],

    props: {
      isExpanded: Boolean
    },

    data () {
      return {
        isAdvancedSearch: false,
        filterName: '',
        isEnded: '',
        isAssignee: '',
        isGuosen: '',
        taskViewData: {
          visible: false,
          order: {}
        },
        processViewData: {
          visible: false,
          order: {}
        }
      }
    },

    mounted () {
      this.getFilterData(this.orderId)
    },

    methods: {
      getIsEnded () {
        this.isEnded = this.taskViewData.order.isend
      },

      getIsAssignee () {
        if (this.taskViewData.order.assign && this.taskViewData.order.assign.userId) {
          console.log('isAssignee' + this.taskViewData.order.assign.userId === this.$store.state.userinfo.userId)
          this.isAssignee = this.taskViewData.order.assign.userId === this.$store.state.userinfo.userId
        } else if (this.taskViewData.order.assign_group) {
          const keyList = this.$store.state.userinfo.groups.reduce((pre, cur) => {
            pre.push(cur.key)
            console.log('isAssignee' + pre)
            return pre
          }, [])
          console.log('isAssignee' + keyList.includes(this.taskViewData.order.assign_group.key))
          this.isAssignee = keyList.includes(this.taskViewData.order.assign_group.key)
        } else {
          this.isAssignee = false
        }
      },

      getIsGuosen () {
        if (this.filterName === '已完成') {
          this.isGuosen = ['host', 'host_my', 'host_machine'].includes(this.processViewData.order.pkey)
        } else {
          this.isGuosen = ['host', 'host_my', 'host_machine'].includes(this.taskViewData.order.pinstance.pkey)
        }
      },

      turnTofinishTask (row) {
        this.onViewProcess(row)
        this.$router.push({ path: `/${this.isGuosen ? 'guosen' : 'procedure'}-info/${this.processViewData.order.pid}/${this.processViewData.order.pd.pname}` })
      },
      turnToUnfinishTask (row) {
        this.onViewTask(row)
        if (this.filterName === '待认领' || this.filterName === '指派') {
          this.$router.push({path: `/procedure-info/${this.taskViewData.order.pinstance.pid}/${this.taskViewData.order.ptask.tname}`, query: { tid: this.taskViewData.order.tid, filter: this.filterName }})
        } else {
          this.$router.push({ path: `/${this.isGuosen ? 'guosen' : 'procedure'}${!this.isAssignee || this.isEnded ? '-info' : ''}/${this.taskViewData.order.pinstance.pid}${!this.isAssignee || this.isEnded ? '' : ('/' + this.taskViewData.order.tid)}/${this.taskViewData.order.ptask.tname}` })
        }
      },
      check (row, colIndex) {
        console.log(row, colIndex)
        if (!colIndex) {
          if (this.filterName === '已完成') {
            this.turnTofinishTask(row)
          } else {
            this.turnToUnfinishTask(row)
          }
        }
      },
      getFilterData (id) {
        let postData = {
          action: 'filter',
          method: 'GET',
          data: { id }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterData = res.data.data
            this.filterName = this.filterData.name
            this.getFilteredTasks()
            this.$nextTick(() => {
              this.resetMessageState()
            })
          }
        })
      },

      onViewTask (order) {
        Object.assign(this.taskViewData, { order })
        this.getIsGuosen()
        this.getIsEnded()
        this.getIsAssignee()
      },

      onViewProcess (order) {
        Object.assign(this.processViewData, { order })
        this.getIsGuosen()
      },

      resetMessageState () {
        switch (this.filterData.name) {
          case '待处理':
            if (this.$store.state.socket.newTask) {
              this.$store.dispatch('socket_onnew')
            }
            break
          case '待认领':
            if (this.$store.state.socket.newAssigned) {
              this.$store.dispatch('socket_onassigned')
            }
            break
          default: break
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .order-search {
    display: none;
    margin: 12px 0;

    &--basic {
      display: block;

      &.collapsed {
        display: none;
      }
    }

    &--advanced {
      display: none;

      &.loomed {
        display: block;
      }

      .el-form {
        &-item {
          margin-bottom: 12px;
        }
      }
    }
  }

  .el-button a {
    color: inherit;

    &:hover {
      text-decoration: none;
    }
  }

  .order-list {
    transition: padding-left .3s ease;

    &.collapsed {
      padding-left: 20px;
    }
  }

  .link-block {
    color: #1d90e6;
    cursor: pointer;
  }
</style>
