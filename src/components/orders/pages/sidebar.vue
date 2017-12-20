<template>
  <div :class="{ 'order-sidebar': true, collapsed: !isExpanded }">
    <spinner v-show="filterLoading"></spinner>
    <h4 class="order-sidebar__title">系统内置</h4>
    <ul class="order-sidebar__list">
      <li class="order-sidebar__item" v-for="filter in (filterList[0] && filterList[0].list)" :class="{ active: $route.params.id === filter.id }">
        <router-link :to="{ path: `/orders/queues/${filter.id}` }">
          <span class="filter-name">{{filter.name}}</span>
          <span style="padding-right: 14px;">
            <i class="filter-number">{{filter.count}}</i>
            <sup v-if="['待处理', '待认领'].includes(filter.name)"
                 v-show="filter.name === '待处理' && $store.state.socket.newTask || filter.name === '待认领' && $store.state.socket.newAssigned"
                 class="sidebar-badge"></sup>
          </span>
        </router-link>
      </li>
    </ul>

    <h4 class="order-sidebar__title">用户自定义</h4>
    <template v-if="filterList[1]">
      <draggable v-model="filterList[1].list" @start="drag=true" @end="drag=false" class="order-sidebar__list draggable">
        <div class="order-sidebar__item draggable-token draggable__token draggable__token--left" v-for="filter in filterList[1].list" :class="{ active: parseInt($route.params.id) === filter.id }">
          <router-link :to="{ path: `/orders/queues/${filter.id}` }">
            <span class="filter-name">{{filter.name}}</span>
            <span>
              <i class="filter-number">{{filter.count}}</i>
              <i class="filter-close el-icon-fa-times" @click.stop.prevent="onDeleteFilter(filter)"></i>
            </span>
          </router-link>
        </div>
      </draggable>
    </template>
    
    <router-link :to="{ path: '/orders/queues/custom/new' }">
      <el-button class="order-sidebar__plus" type="text" size="small" icon="plus">新队列</el-button>
    </router-link>
    <router-link :to="{ path: '/orders-export/print' }">
      <el-button class="order-sidebar__export" type="text" size="small" icon="document">工单导出</el-button>
    </router-link>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import spinner from 'vue-simple-spinner'
  import EventHub from './../../../utils/event-hub'

  export default {
    props: {
      isExpanded: Boolean
    },

    data () {
      return {
        filterList: [],
        filterLoading: true
      }
    },

    watch: {
      filterList: {
        handler (val) {
          let orderList = val[1].list.map(_ => _.id)
          let postData = {
            action: 'filters/order',
            method: 'POST',
            data: {
              ids: orderList
            }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              return
            }
          })
        },
        deep: true
      }
    },

    created () {
      this.getFilterList()

      EventHub.$on('should-refetch-filters', this.getFilterList)
    },

    methods: {
      getFilterList () {
        let postData = {
          action: 'filters',
          method: 'GET',
          data: {}
        }
        this.filterLoading = true
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            const filter = res.data.data.list
            this.filterList = filter
            // this.$store.dispatch('get_first_filter', { filter })
            this.filterLoading = false
          }
        })
      },

      onDeleteFilter ({ name, id }) {
        this.$confirm(`确定删除筛选器「${name}」？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            action: 'filter',
            method: 'DELETE',
            data: { id }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '已删除！'
              })
              this.getFilterList()
            }
          })
        })
      }
    },

    components: {
      draggable,
      spinner
    }
  }
</script>

<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");

  .order-sidebar {
    position: fixed;
    top: @headerHeight;
    left: @sidebarWidth;
    width: 200px;
    height: calc(100vh ~"-" @headerHeight ~"-" @footerHeight);
    padding: 14px;
    border-right: 1px solid @borderColor;
    overflow-y: scroll;
    transition: all .3s ease;
    a{
      &:hover,
      &:link,
      &:active {
        text-decoration: none
      }
    }
    &__title {
      margin: 12px;
      font-size: 15px;
      color: @textColor;
    }

    &__list {
      padding: 0;
      margin: 12px 0;

      &.draggable {
        border: none;
      }
    }

    &__item {
      width: 100%;
      font-size: 14px;
      line-height: 32px;
      padding: 0 12px 0 16px;
      position: relative;

      &.active {
        .filter-name {
          color: #000;
          font-weight: bold;
        }
      }

      a {
        color: @eoThemeColor;
        display: flex;
        justify-content: space-between;

        &:hover,
        &:link,
        &:active {
          text-decoration: none;
        }
      }

      &:hover {
        background-color: @bgLighter;

        .filter-close {
          opacity: 1;
        }
      }

      .filter-number,
      .filter-close {
        color: @textColor;
      }

      .filter-close {
        opacity: 0;
        &:hover {
          color: @danger;
        }
      }
    }
    &__export {
      display: block;
      margin-left: 12px
    }
    &__plus {
      margin-left: 12px;
    }

    .sidebar-badge {
      position: absolute;
      top: 12px;
      right: 14px;
    }

    &.collapsed {
      transform: translateX(-200px);
      opacity: 0;
    }
  }
</style>
