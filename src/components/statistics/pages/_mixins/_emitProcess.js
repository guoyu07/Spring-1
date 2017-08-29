export default {
  computed: {
    processList () {
      return this.processes
    }
  },

  data () {
    return {
      // processList: this.processes,
      selectedProcess: {}
    }
  },

  methods: {
    onSelectProcess () {
      this.$emit('on-select-process', { val: this.selectedProcess })
    }
  }
}
