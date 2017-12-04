export default {
  methods: {
    _validateTimeQuery () {
      switch (this.timeQuery.type) {
        case 'range':
          if (this.timeQuery.s_date && this.timeQuery.e_date) return true
          break
        case 'before':
        case 'after':
          if (this.timeQuery.time && this.timeQuery.unit) return true
          break
        default:
          return false
      }
    },

    getListByTimeQuery (cb) {
      // this.timeQuery = args.val
      if (this._validateTimeQuery()) {
        // console.log('pass')
        cb()
      }
    }
  }
}
