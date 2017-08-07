<template>
  <div class="order-sidebar">
    <ul class="order-sidebar__list">
      <li class="order-sidebar__item" v-for="filter in filterList">
        <router-link :to="{ path: `/orders/queues/${filter.filter.id}` }">
          <span>{{filter.filter.name}}</span>
          <span>
            <i class="filter-number">{{filter.count}}</i>
            <i class="filter-close el-icon-fa-times" @click="onDeleteFilter(filter.filter)"></i>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        filterList: [{
          'filter': {
            'name': '待处理',
            'id': 1,
            'filter': [{
              'label': '当前处理人',
              'key': 'assign',
              'type': 'user',
              'filter': [{
                'userId': '$current_user',
                'nick': '当前用户'
              }]
            }],
            'show': [{
              'label': '流程单号',
              'key_path': 'pinstance.pnum'
            }],
            'order': '-ctime'
          },
          'count': 10,
          'can_edit': false
        }, {
          'filter': {
            'name': '待处理',
            'id': 2,
            'filter': {
              'type': 'after',
              'time': 2,
              'unit': 'd'
            },
            'show': [{
              'label': '流程单号',
              'key_path': 'pinstance.pnum'
            }],
            'order': '-ctime'
          },
          'count': 5,
          'can_edit': true
        }]
      }
    },

    methods: {
      onDeleteFilter ({ name, id }) {
        this.$confirm(`确定删除筛选器「${name}」？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已删除！'
          })
        })
      }
    }
  }
</script>

<style lang="less">
  @import url("./../../../assets/css/variables.less");

  .order-sidebar {
    position: fixed;
    top: @headerHeight;
    left: @sidebarWidth;
    width: 200px;
    // height: ~"calc(100vh - @{headerHeight} - @{footerHeight})"
    height: calc(100vh ~"-" @headerHeight ~"-" @footerHeight);
    padding: 14px;
    border-right: 1px solid @borderColor;
    overflow-y: scroll;

    &__list {
      padding: 0;
    }

    &__item {
      width: 100%;
      font-size: 14px;
      line-height: 32px;
      padding: 0 12px;

      a {
        color: @eoThemeColor;
        display: flex;
        justify-content: space-between;

        &:hover,
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
          color: @eoThemeColor;
        }
      }
    }
  }
</style>