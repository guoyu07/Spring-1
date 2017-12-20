export default {
  methods: {
    _validateTimeQuery () {
      switch (this.timeQuery.type) {
        case 'range':
          if (this.timeQuery.s_date && this.timeQuery.e_date) return true
          break
        case 'before':
        case 'after':
          if (this.timeQuery.time >= 0 && this.timeQuery.unit) return true
          break
        case 'week':
          if (this.timeQuery.time >= 0) return true
          break
        case 'month':
          if (this.timeQuery.time >= 0) return true
          break
        default:
          return false
      }
    },

    getListByTimeQuery (cb) {
      // this.timeQuery = args.val
      if (this._validateTimeQuery()) {
        console.log('Time query validated')
        cb()
      }
    }
  }
}
