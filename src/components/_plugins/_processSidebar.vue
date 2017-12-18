<template>
  <div :class="{ 'order-sidebar': true, collapsed: !isExpanded }">
    <div v-for="(lists, index) in category">
      <h4 class="order-sidebar__title">
        {{lists.name}}
      </h4>
      <ul  class="order-sidebar__list">
        <li class="order-sidebar__item" v-for="list in lists.list" :class="{ active: $route.params.pkey === list.key }">
          <router-link :to="{ path: `${route}${list.key}` }">
            <span class="filter-name">{{list.label}}</span>
            <span style="padding-right: 14px;">
<!--               <i class="filter-number">{{filter.count}}</i> -->
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isExpanded: Boolean,
      route: String
    },

    data () {
      return {
        category: []
      }
    },

    created () {
      this.getNavCategory()
    },

    methods: {
      getNavCategory () {
        let postData = {
          action: 'process/names',
          method: 'GET',
          data: {
            group: true
          }
        }
        this.http.post('/api/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.category = res.data.data.list
            console.log(res.data.data.list)
          }
        })
      }
    },

    components: {
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../assets/css/variables.less");

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
