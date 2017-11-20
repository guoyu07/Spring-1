<template>
  <div class="counters">
    <div class="counter" v-for="counter in counterData">
      <div class="counter-title">{{counter.name}}</div>
      <div class="counter-count">{{counter.count}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        counterData: []
      }
    },

    created () {
      this.getCounterData()
    },

    methods: {
      getCounterData () {
        let postData = {
          action: 'dashboard/status/count',
          method: 'GET',
          data: {}
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.counterData = res.data.data.list
            // await this.$set(this.counterData, res.data.data.list)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .counters {
    display: flex;
    justify-content: space-between;

    .counter {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
</style>