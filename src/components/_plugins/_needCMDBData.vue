<template>
  <div>
    <template v-if="strucData.value.type === 'dict'">
      <el-select
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        filterable>
        <el-option v-for="option in optionList"
          :label="option[strucData.value.source.res.show_key]"
          :value="option"></el-option>
      </el-select>
      <el-radio-group
        v-else
        v-model="vmodel[strucData.id]">
        <el-radio v-for="option in optionList" :label="option">{{option[strucData.value.source.res.show_key]}}</el-radio>
      </el-radio-group>
    </template>

    <template v-else-if="strucData.value.type === 'dicts'">
      <el-select
        filterable
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :allow-create="strucData.value.allow_create"
        multiple>
        <el-option v-for="option in optionList"
          :label="option[strucData.value.source.res.show_key]"
          :value="option"></el-option>
      </el-select>
      <el-checkbox-group
        v-else
        v-model="vmodel[strucData.id]">
        <el-checkbox v-for="option in optionList" :label="option" :name="strucData.id">{{option[strucData.value.source.res.show_key]}}</el-checkbox>
      </el-checkbox-group>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      vmodel: { type: Object },
      whole: { type: Object },
      message: { type: Object },
      strucData: { type: Object },
      index: { type: Number }
    },

    data () {
      return {
        optionList: []
      }
    },
    created () {
      if (this.strucData.watch) {
        this.$watch('vmodel.' + this.strucData.watch, (newVal, oldVal) => {
          this.renderOptions()
        })
      } else {
        this.renderOptions()
      }
    },

    methods: {
      renderOptions () {
        if (!this.strucData.default.type) { // 没有默认值时，每次 watch 发一次请求之前都重置值，有默认值则不需要重置值
          if (this.strucData.value.type === 'dicts') {
            this.vmodel[this.strucData.id] = [] // 重置
          } else {
            this.vmodel[this.strucData.id] = {} // 重置
          }
        } else {
          // 这个是默认值
          console.log(this.vmodel[this.strucData.id])
        }
        let params = {}
        if (this.strucData.value.source.data.params.length !== 0) {
          for (const para of this.strucData.value.source.data.params) {
            if (para.value.type === 'static') {
              params[para.id] = para.value.value
            } else if (para.value.type === 'form_header') {
              if (this.getPathResult(this.whole && this.whole.header, para.value.key_path)) {
                // 这里要区分一下 this.whole.header 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.whole.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'form_body') {
              if (this.getPathResult(this.whole && this.whole.body[this.index], para.value.key_path)) {
                // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.whole.body[this.index], para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'message_header') {
              if (this.getPathResult(this.message && this.message.header, para.value.key_path)) {
                // 这里要区分一下 this.message.header 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'message_body') {
              if (this.getPathResult(this.message && this.message.body[this.index], para.value.key_path)) {
                // 这里要区分一下 this.message.body[this.index] 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.body[this.index], para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
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
          // 将默认值(对象类型)放回值里面
          if (this.vmodel[this.strucData.id] && this.vmodel[this.strucData.id].instanceId) {
            this.optionList.map(option => {
              if (option.instanceId === this.vmodel[this.strucData.id].instanceId) {
                this.vmodel[this.strucData.id] = option
              }
            })
          }
          if (this.strucData.value.source.data.action === 'import/device/items') {
            this.vmodel[this.strucData.id] = this.optionList[0]
          } else if (this.strucData.value.source.data.action === 'export/device/items') {
            this.vmodel[this.strucData.id] = this.optionList[0]
          } else if (this.strucData.value.source.data.action === 'users/all') {
            if (this.strucData.default.type) {
              if (this.strucData.default.type === 'static' && this.strucData.default.value === '$author') {
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
              }
            }
          } else if (this.strucData.value.source.data.action === 'object/instance/list' && params.object_id === 'USER') {
            if (this.strucData.default.type) {
              if (this.strucData.default.type === 'static' && this.strucData.default.value === '$author') {
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
            }
          }
        })
      }
    }
  }
</script>
