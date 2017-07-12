<template>
  <div>
    <template v-if="strucData.value.type === 'dict'">
      <el-select
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable>
          <el-option  v-for="option in optionList"
                      :label="showLabel(option)"
                      :value="option">
                      <p>{{ showLabel(option) }}</p>
                      <p style="color: #8492a6; font-size: 13px">{{ toolTipContent(option) }}</p>
          </el-option>
      </el-select>
      <el-radio-group
        v-else
        v-model="vmodel[strucData.id]"
        :disabled="strucData.readonly">
        <el-radio v-for="option in optionList" :label="option">{{option[strucData.value.source.res.show_key]}}</el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="strucData.value.type === 'dicts'">
      <el-select
        filterable
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        multiple>
        <el-option v-for="option in optionList"
          :label="option[strucData.value.source.res.show_key]"
          :value="option"></el-option>
      </el-select>
      <el-checkbox-group
        v-else
        v-model="vmodel[strucData.id]"
        :disabled="strucData.readonly">
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
      index: { type: Number },
      tableIndex: { type: Number },
      bodyTable: { type: Boolean },
      headerTable: { type: Boolean }
    },
    data () {
      return {
        optionList: [],
        limitNum: 0,
        limitMaxNum: 0,
        showToolTip: false
      }
    },
    created () {
      if (this.strucData.value.source.res.show_key.length <= 1) {
        this.showToolTip = true
      }
      for (const para of this.strucData.value.source.data.params) {
        let keyPath
        if (para.value.key_path) {
          keyPath = para.value.key_path.split('.')
          if (para.value.type === 'form_header') {
            this.$watch('whole.header.' + keyPath[0], (newVal, oldVal) => {
              this.renderOptions()
            }, { deep: true })
          } else if (para.value.type === 'form_body') {
            if (this.bodyTable || this.headerTable) {
              this.$watch('whole.' + keyPath[0], (newVal, oldVal) => {
                console.log(newVal)
                this.renderOptions()
              }, { deep: true })
            } else {
              this.$watch('whole.body.' + this.index + '.' + keyPath[0], (newVal, oldVal) => {
                this.renderOptions()
              }, { deep: true })
            }
          }
        }
      }
      if (this.strucData.watch) {
        this.$watch('vmodel.' + this.strucData.watch, (newVal, oldVal) => {
          // console.log(this.strucData.watch)
          this.renderOptions()
        })
      } else {
        // console.log(this.strucData.name, 'hello')
        this.renderOptions()
      }
    },
    methods: {
      showLabel (option) {
        if (Array.isArray(this.strucData.value.source.res.show_key)) {
          return option[this.strucData.value.source.res.show_key[0]]
          // return this.strucData.value.source.res.show_key.reduce((prev, cur) => {
          //   return prev ? (prev + ' - ' + option[cur]) : (prev + option[cur])
          // }, '')
        } else {
          // 暂时为了兼容之前的字符串，以后全都是数组
          return option[this.strucData.value.source.res.show_key]
        }
      },
      toolTipContent (option) {
        if (Array.isArray(this.strucData.value.source.res.show_key)) {
          return this.strucData.value.source.res.show_key.reduce((prev, cur, index) => {
            if (index) {
              return prev ? (prev + ' - ' + option[cur]) : (prev + option[cur])
            } else {
              return ''
            }
          }, '')
        } else {
          return ''
        }
      },
      renderOptions () {
        // this.whole 区分是不是快速编辑 快速编辑 不传 whole, 需要原值
        if (!this.strucData.default.type && this.whole) { // 没有默认值时，每次 watch 发一次请求之前都重置值，有默认值则不需要重置值
          if (this.strucData.value.type === 'dicts') {
            this.vmodel[this.strucData.id] = []
          } else {
            this.vmodel[this.strucData.id] = null
          }
        } else {
          // 这个是默认值
          // console.log(this.vmodel[this.strucData.id], this.strucData)
        }
        if (!this.strucData.value.source) {
          this.$message({
            showClose: true,
            message: `${this.strucData.name}的表单配置信息不完整`,
            duration: 0,
            type: 'error'
          })
          return false
        }
        let params = {}
        if (this.strucData.value.source.data.params.length !== 0) {
          for (const para of this.strucData.value.source.data.params) {
            if (para.value.type === 'static') {
              params[para.id] = para.value.value
            } else if (para.value.type === 'form_header') {
              if (this.whole && this.getPathResult(this.whole.header, para.value.key_path) !== undefined) {
                // 这里要区分一下 this.whole.header 的 id 的值是对象还是数组, 数组的话，getPathResult 还有一个参数 k
                params[para.id] = this.getPathResult(this.whole.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'form_body') {
              if (this.bodyTable || this.headerTable) {
                if (this.getPathResult(this.whole, para.value.key_path) !== undefined) {
                  // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                  params[para.id] = this.getPathResult(this.whole, para.value.key_path)
                } else {
                  return false // 如果没取到值就不发请求
                }
              } else {
                if (this.whole && this.getPathResult(this.whole.body[this.index], para.value.key_path) !== undefined) {
                  // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                  params[para.id] = this.getPathResult(this.whole.body[this.index], para.value.key_path)
                  // console.log(this.strucData.name, params[para.id])
                } else {
                  console.log(para.value.key_path)
                  return false // 如果没取到值就不发请求
                }
              }
            } else if (para.value.type === 'message_header') {
              if (this.message && this.getPathResult(this.message.header, para.value.key_path) !== undefined) {
                // 这里要区分一下 this.message.header 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'message_body') {
              // console.log(this.getPathResult(this.message.body[this.index], para.value.key_path, 0))
              if (this.message && this.getPathResult(this.message.body[this.index], para.value.key_path, 0) !== false) {
                // 这里要区分一下 this.message.body[this.index] 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.body[this.index], para.value.key_path, 0)
              } else {
                this.$message.warning(`取不到 message_body 里的 ${para.value.key_path} 值`)
                return false // 如果没取到值就不发请求
              }
            }
          }
        }
        // console.log(this.strucData.name, params)
        const postHeadvData = {
          action: this.strucData.value.source.data.action,
          method: this.strucData.value.source.data.method,
          data: params
        }
        // 如果没有设置action或者method，不发请求
        if (!postHeadvData.action || !postHeadvData.method) {
          this.optionList = []
          if (this.vmodel[this.strucData.id]) {
            this.optionList.push(this.vmodel[this.strucData.id])
          }
          return false
        }
        this.http.post(this.strucData.value.source.url.substring(4), this.parseData(postHeadvData))
        .then((response) => {
          this.optionList = this.getPathResult(response, this.strucData.value.source.res.data_path)
          // 配置默认值
          if (this.strucData.default && this.strucData.default.type) {
            if (this.strucData.default.type === 'api') {
              if (Array.isArray(this.vmodel[this.strucData.id])) {
                let keyData
                if (this.strucData.limit.type === 'message_body') {
                  keyData = this.getPathResult(this.message.body[this.index], this.strucData.limit.key_path)
                } else if (this.strucData.limit.type === 'message_header') {
                  console.log(this.message)
                  keyData = this.getPathResult(this.message.header, this.strucData.limit.key_path)
                } else if (this.strucData.limit.type === 'static') {
                  keyData = this.strucData.limit.min
                  this.limitMaxNum = this.strucData.limit.max
                } else if (this.strucData.limit.type === 'form_body') {
                  keyData = this.getPathResult(this.whole.body[this.index], this.strucData.limit.key_path) // this.whole.body[this.index] 就是 this.item
                } else if (this.strucData.limit.type === 'form_header') {
                  keyData = this.getPathResult(this.whole.header, this.strucData.limit.key_path)
                }
                if (Array.isArray(keyData)) {
                  this.limitNum = keyData.length
                } else if (typeof keyData === 'number') {
                  this.limitNum = keyData
                } else if (typeof keyData === 'string') {
                  if (typeof +keyData === 'number') {
                    this.limitNum = +keyData
                  } else {
                    this.$message('limit数据配置有误')
                  }
                }
                if ((this.limitNum + +this.strucData.default.value) <= this.optionList.length) {
                  this.vmodel[this.strucData.id] = this.optionList.slice(this.strucData.default.value, this.limitNum)
                } else if (this.limitNum <= this.optionList.length) {
                  this.$message.warning(`${this.strucData.name}的选项不够${+this.limitNum + +this.strucData.default.value}项`)
                  this.vmodel[this.strucData.id] = this.optionList.slice(0, this.limitNum)
                } else {
                  this.vmodel[this.strucData.id] = this.optionList
                  this.$message.warning(`${this.strucData.name}数据项不足`)
                }
              } else {
                let optionIndex = 0
                if (this.strucData.unique) { // 如果是唯一值，跟着当前 index 来走
                  let tableIndex = 0
                  if (this.tableIndex) tableIndex = this.tableIndex
                  optionIndex = this.index + tableIndex
                }
                const selectedIndex = optionIndex + +this.strucData.default.value
                if (selectedIndex < this.optionList.length) {
                  this.vmodel[this.strucData.id] = this.optionList[selectedIndex]
                } else if (this.optionList[0]) {
                  this.$message.warning(`${this.strucData.name}的选项不够${selectedIndex}项`)
                  this.vmodel[this.strucData.id] = this.optionList[0]
                } else {
                  this.$message.warning(`${this.strucData.name}无数据`)
                }
              }
            }
          }
          if (this.strucData.value.source.data.action === 'users/all') {
            // let userlist = []
            // this.optionList.map(list => {
            //   if (userlist.some(item => { return item.label === list.groups[0].key })) {

            //   }
            // })
            if (this.strucData.default && this.strucData.default.type) {
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
          // 将默认值(对象类型)放回值里面
          if (this.vmodel[this.strucData.id]) {
            if (Array.isArray(this.vmodel[this.strucData.id])) {
              this.vmodel[this.strucData.id].map((item, itemindex) => {
                if (item[this.strucData.value.source.res.show_key]) {
                  this.optionList.map(option => {
                    if (option[this.strucData.value.source.res.show_key] === item[this.strucData.value.source.res.show_key]) {
                      // item = option
                      this.vmodel[this.strucData.id][itemindex] = option
                    } else {
                      if (!this.optionList.includes(item)) {
                        this.optionList.push(item)
                      }
                    }
                  })
                }
              })
            } else {
              if (this.vmodel[this.strucData.id][this.strucData.value.source.res.show_key[0]]) {
                this.optionList.map(option => {
                  if (option[this.strucData.value.source.res.show_key[0]] === this.vmodel[this.strucData.id][this.strucData.value.source.res.show_key[0]]) {
                    this.vmodel[this.strucData.id] = option
                    return false
                  } else {
                    if (!this.optionList.includes(this.vmodel[this.strucData.id])) {
                      this.optionList.push(this.vmodel[this.strucData.id])
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
