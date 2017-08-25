<template>
  <div class="item">
    <time-query></time-query>
    <router-view></router-view>
  </div>
</template>

<script>
  import timeQuery from './pages/_plugins/_timeQuery.vue'
  export default {
    components: { timeQuery }
  }
</script>