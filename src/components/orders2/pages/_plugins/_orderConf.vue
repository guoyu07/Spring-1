<template>
  <div>
    <el-select v-model="selectedOrder" value-key="key">
      <el-option v-for="field in orderFields" :label="field.label" :value="field"></el-option>
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
    },

    watch: {
      selectedOrder: {
        handler (val, oldVal) {
          if (_._isEmpty(oldVal)) return
          console.log('emitted!')
          this.$emit('on-order-change', { order: val.key })
        },
        deep: true
      },

      isAsce (val, oldVal) {
        if (!val) {
          this.selectedOrder.key = '-' + this.selectedOrder.key
        } else if (val && !oldVal) {
          this.selectedOrder.key = this.selectedOrder.key.slice(1)
        }
      }
    },

    data () {
      return {
        orderFields: [],
        selectedOrder: {},
        isAsce: false
      }
    },

    mounted () {
      this.getOrderFields()
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
            this.orderFields = res.data.data.list
            this.initializeSelectedOrder()
          }
        })
      },

      initializeSelectedOrder () {
        let orderKey = this.order.charAt(0) === '-'
                     ? this.order.slice(1)
                     : this.order
        this.selectedOrder = this.orderFields.find(_ => _.key === orderKey)
        this.isAsce = !!(this.selectedOrder.key.charAt(0) !== '-')
      },

      onToggleOrder () {
        this.isAsce = !this.isAsce
      }
    }
  }
</script>

<style>
  .order-arrow {
    margin-left: 6px;
  }
</style>