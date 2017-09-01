<template>
  <div class="wrapper">
    <info :params="$route.params" :query="$route.query"></info>
  </div>
</template>
<script>
  import info from './_plugins/_info'

  export default {
    data () {
      return {
      }
    },
    methods: {
    },
    components: {
      info
    }
  }
</script>
