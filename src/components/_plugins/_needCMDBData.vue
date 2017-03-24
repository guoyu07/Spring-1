<template>
  <div>
    <el-select
      v-if="strucData.value.type === 'dist'"
      v-model="vmodel[strucData.id]"
      filterable>
      <el-option v-for="option in optionList"
        :label="option[strucData.value.source.res.show_key]"
        :value="option"></el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    props: {
      vmodel: { type: Object },
      strucData: { type: Object }
    },

    data () {
      return {
        optionList: []
      }
    },
    created () {
      if (this.strucData.value.type === 'dist') {
        let params = {}
        if (this.strucData.value.source.data.params.length !== 0) {
          for (const para of this.strucData.value.source.data.params) {
            if (para.value.type === 'static') {
              params[para.id] = para.value.value
            }
          }
        }
        const postHeadvData = {
          action: this.strucData.value.source.data.action,
          method: this.strucData.value.source.data.method,
          data: params
        }
        this.http.post(this.strucData.value.source.url.substring(4), this.parseData(postHeadvData))
        .then((response) => {
          this.optionList = response[this.strucData.value.source.res.data_path]
        })
      }
    },

    methods: {

    }
  }
</script>
