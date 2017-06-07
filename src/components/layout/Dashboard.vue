<style lang="less" scoped>
  @import url("../../assets/css/variables");

  .dashboard {
    padding: .4em 1.2em;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    list-style: none;
    padding: 0;
    margin: .2em 0 1.6em;
  }

  .category {
    font-weight: 400;
    margin-bottom: 0;
  }

  .entry {
    flex: none;
    padding: 1.5em 0 0 1.5em;
    margin-right: 1.5em;
    color: @eoTextColor;

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      line-height: 0;
      border-radius: 100%;
      background-color: @eoThemeColor;
      margin-bottom: .6em;

      span {
        font-size: 36px !important;
        color: #fff;
      }
    }

    &__title {
      font-size: 14px;
      line-height: 1;
      text-align: center;
    }

    &:hover {
      cursor: pointer;

      .entry__icon {
        background-color: @primary;
      }

      .entry__title {
        color: @textColor;
      }
    }
  }
</style>

<template>
  <div class="dashboard">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <template v-for="entry in entries">
          <el-col :sm="24" :md="12">
            <h4 class="category">{{entry.category}}</h4>
            <ul class="grid">
              <li v-for="child in entry.children" class="entry" @click="onEntryClick(child.path)">
                <div class="entry__icon">
                  <span :class="'el-icon-' + child.icon"></span>
                </div>
                <div class="entry__title">{{child.title}}</div>
              </li>
            </ul>
          </el-col>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        entries: [{
          category: '流程',
          children: [{
            icon: 'fa-upload',
            title: '上架流程',
            path: '/guosen/on'
          }, {
            icon: 'fa-magic',
            title: '测试流程',
            path: '/test/start'
          }, {
            icon: 'fa-sign-in',
            title: '设备入库',
            path: '/store-manage/instock'
          }, {
            icon: 'fa-sign-out',
            title: '设备出库',
            path: '/store-manage/outstock'
          }, {
            icon: 'fa-edit',
            title: '设备变更',
            path: '/store-manage/alter_device'
          }, {
            icon: 'fa-upload',
            title: '设备上架',
            path: '/equipment/on'
          }, {
            icon: 'fa-envelope-open-o',
            title: '服务器申请',
            path: '/system/apply'
          }, {
            icon: 'fa-star',
            title: '系统上线',
            path: '/system/onlinelist'
          }]
        }, {
          category: '工单管理',
          children: [{
            icon: 'fa-calendar-o',
            title: '工单管理',
            path: '/orders'
          }]
        }, {
          category: '自定义平台',
          children: [{
            icon: 'fa-sitemap',
            title: 'BPMN 配置',
            path: '/custom'
          }, {
            icon: 'fa-wpforms',
            title: '表单配置',
            path: '/forms'
          }]
        }]
      }
    },

    methods: {
      onEntryClick (path) {
        this.$router.replace(path)
      }
    }
  }
</script>
