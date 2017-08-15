<template>
  <div>
    <el-select v-model="selectedOrder" filterable value-key="key">
      <el-option v-for="field in orderList" :label="field.label" :value="field"></el-option>
    </el-select>
    <span :class="[arrowClass, 'order-arrow']" @click="onToggleOrder"></span>
  </div>
</template>

<script>
  import _ from './../../../../utils/_'

  export default {
    props: {
      order: String
    },

    computed: {
      arrowClass () {
        return {
          'text-success': this.isAsce,
          'el-icon-fa-long-arrow-up': this.isAsce,
          'text-warning': !this.isAsce,
          'el-icon-fa-long-arrow-down': !this.isAsce
        }
      }

      // selectedOrder () {
      //   if (_._isEmpty(this.order) || !this.orderList.length) return null
      //   let orderKey = this.order.charAt(0) === '-'
      //                ? this.order.slice(1)
      //                : this.order
      //   return this.orderList.find(_ => _.key === orderKey)
      // },

      // isAsce () {
      //   if (_._isEmpty(this.order) || !this.selectedOrder) return false
      //   return !!(this.selectedOrder.key.charAt(0) !== '-')
      // }
    },

    watch: {
      selectedOrder: {
        handler (val, oldVal) {
          if (_._isEmpty(oldVal)) return
          console.log('emitted!')
          this.$emit('on-order-change', { order: val.key })
        },
        deep: true
      }
    },

    data () {
      return {
        orderList: [],
        selectedOrder: null,
        isAsce: false
      }
    },

    created () {
      this.$nextTick(() => {
        this.getOrderFields()
      })
    },

    methods: {
      getOrderFields () {
        let postData = {
          action: 'filter/order/fields',
          method: 'GET',
          data: {}
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.orderList = res.data.data.list
            this.initializeSelectedOrder()
          }
        })
      },

      initializeSelectedOrder () {
        let orderKey = this.order.charAt(0) === '-'
                     ? this.order.slice(1)
                     : this.order
        this.selectedOrder = this.orderList.find(_ => _.key === orderKey)
        this.isAsce = !!(this.selectedOrder.key.charAt(0) !== '-')
      },

      onToggleOrder () {
        this.isAsce = !this.isAsce
        if (!this.isAsce) {
          for (let item of this.orderList) {
            item.key = '-' + item.key
          }
          // this.selectedOrder.key = '-' + this.selectedOrder.key
        } else {
          // this.selectedOrder.key = this.selectedOrder.key.slice(1)
          for (let item of this.orderList) {
            item.key = item.key.slice(1)
          }
        }
      }
    }
  }
</script>

<style>
  .order-arrow {
    margin-left: 6px;
  }
</style>