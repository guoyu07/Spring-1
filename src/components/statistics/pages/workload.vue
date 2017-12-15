<template>
  <div>
    <sidebar :is-expanded="isExpanded" route="/workload/"></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
  import sidebar from './../../_plugins/_processSidebar'

  export default {
    data () {
      return {
        isExpanded: true
      }
    },

    components: { sidebar }
  }
</script>