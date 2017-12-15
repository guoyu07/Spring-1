<template>
  <div class="orders">
    <span :class="{ 'orders-toggle': true, collapsed: !isExpanded }" @click="onToggleSidebar">
      <i :class="isExpanded ? 'el-icon-fa-angle-left' : 'el-icon-fa-angle-right'"></i>
    </span>
    <sidebar :is-expanded="isExpanded" route="/orders-export/print/"></sidebar>
    <router-view :is-expanded="isExpanded" class="order-view"></router-view>
  </div>
</template>

<script>
  import sidebar from '../_plugins/_processSidebar'

  export default {
    data () {
      return {
        isExpanded: true
      }
    },

    methods: {
      onToggleSidebar () {
        this.isExpanded = !this.isExpanded
      }
    },

    components: {
      sidebar
    }
  }
</script>

<style lang="less">
  @import url("./../../assets/css/variables.less");
  .orders {
    position: relative;

    &-toggle {
      width: 14px;
      height: 28px;
      background-color: #e2f0ff;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: fixed;
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
      position: fixed;
      left: 400px;
      top: 50%;
      transform: translateY(-50%);
      transition: left .3s ease;

      i {
        margin-right: 6px;
        font-size: 14px;
        color: @borderColor;
      }

      &.collapsed {
        left: 200px;
      }
    }
  }
    .order-view {
    padding: 20px;
    padding-left: 220px;
  }
</style>
