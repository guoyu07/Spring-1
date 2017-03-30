<template>
  <div>
    <el-select
      v-model="vmodel[strucData.id]"
      :multiple="strucData.value.type === 'dicts'"
      filterable>
      <el-option v-for="option in optionList"
        :label="option[strucData.value.source.res.show_key]"
        :value="option"></el-option>
    </el-select>

    <!-- <el-select
      v-else-if="strucData.value.type === 'dicts'"
      v-model="vmodel[strucData.id]"
      filterable
      multiple>
      <el-option v-for="option in optionList"
        :label="option[strucData.value.source.res.show_key]"
        :value="option[strucData.value.source.res.show_key]"></el-option>
    </el-select> -->
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
      // if (this.strucData.value.type === 'dict' || this.strucData.value.type === 'dicts') {
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
        this.optionList = this.getPathResult(response, this.strucData.value.source.res.data_path)
        if (this.strucData.value.source.data.action === 'import/device/items') {
          this.vmodel[this.strucData.id] = this.optionList[0]
        } else if (this.strucData.value.source.data.action === 'users/all') {
          const user = window.localStorage.userName
          this.optionList.map(option => {
            if (option.userId === user) {
              if (Array.isArray(this.vmodel[this.strucData.id])) {
                this.vmodel[this.strucData.id].push(option)
              } else {
                this.vmodel[this.strucData.id] = option
              }
            }
          })
        } else if (this.strucData.value.source.data.action === 'object/instance/list' && params.object_id === 'USER') {
          const user = window.localStorage.userName
          this.optionList.map(option => {
            if (option.name === user) {
              if (Array.isArray(this.vmodel[this.strucData.id])) {
                this.vmodel[this.strucData.id].push(option)
              } else {
                this.vmodel[this.strucData.id] = option
              }
            }
          })
        }
      })
      // }
    },

    methods: {

    }
  }
</script>
