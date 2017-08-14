<template>
  <div class="order-sidebar">
    <h4 class="order-sidebar__title">系统内置</h4>
    <ul class="order-sidebar__list">
      <li class="order-sidebar__item" v-for="filter in filterList[0].list" :class="{ active: parseInt($route.params.id) === filter.id }">
        <router-link :to="{ path: `/orders/queues/${filter.id}` }">
          <span class="filter-name">{{filter.name}}</span>
          <span>
            <i class="filter-number">{{filter.count}}</i>
            <i class="filter-close el-icon-fa-times" @click="onDeleteFilter(filter)"></i>
          </span>
        </router-link>
      </li>
    </ul>

    <h4 class="order-sidebar__title">用户自定义</h4>
    <draggable v-model="filterList[1].list" @start="drag=true" @end="drag=false" class="order-sidebar__list draggable">
      <div class="order-sidebar__item" v-for="filter in filterList[1].list" :class="{ active: parseInt($route.params.id) === filter.id }">
        <router-link :to="{ path: `/orders/queues/${filter.id}` }">
          <span class="filter-name">{{filter.name}}</span>
          <span>
            <i class="filter-number">{{filter.count}}</i>
            <i class="filter-close el-icon-fa-times" @click="onDeleteFilter(filter)"></i>
          </span>
        </router-link>
      </div>
    </draggable>
    <router-link :to="{ path: '/orders/queues/custom/new' }">
      <el-button class="order-sidebar__plus" type="text" size="small" icon="plus">新队列</el-button>
    </router-link>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    data () {
      return {
        filterList: []
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
    },

    methods: {
      getFilterList () {
        let postData = {
          action: 'filters',
          method: 'GET',
          data: {}
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterList = res.data.data.list
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
      draggable
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
    height: calc(100vh ~"-" @headerHeight ~"-" @footerHeight);
    padding: 14px;
    border-right: 1px solid @borderColor;
    overflow-y: scroll;

    &__title {
      margin: 12px;
      font-size: 15px;
      color: @textColor;
    }

    &__list {
      padding: 0;
      margin: 12px 0;

      &.draggable {
        .order-sidebar__item {
          &::before {
            content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAALCAYAAAC3ZUeVAAAAJUlEQVQI12OYOXPmfyhmgLEZcAliYAbitf//D8EgQRibgV62AwAP/odG9/7LRgAAAABJRU5ErkJggg==);
            position: absolute;
            left: 4px;
          }
        }
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

    &__plus {
      margin-left: 12px;
    }
  }
</style>