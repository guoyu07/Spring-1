<template>
  <div>
    <template v-if="strucData.value.type === 'dict'">
      <el-select
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        remote
        :remote-method="filterList">
          <el-option  v-for="(option, optionIndex) in showOptionList"
                      :key="optionIndex"
                      :label="showLabel(option)"
                      :value="option">
                      <span>{{ showLabel(option) }}</span>
                      <p style="color: #8492a6; font-size: 13px">{{ toolTipContent(option) }}</p>
          </el-option>
      </el-select>
      <el-radio-group
        v-else
        v-model="vmodel[strucData.id]"
        :disabled="strucData.readonly">
        <el-radio v-for="(option, optionIndex) in optionList" :key="optionIndex" :label="option">{{option[strucData.value.source.res.show_key[0]]}}</el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="strucData.value.type === 'dicts'">
      <el-select
        filterable
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        multiple
        remote
        :remote-method="filterList">
          <el-option  v-for="(option, optionIndex) in showOptionList"
                      :key="optionIndex"
                      :label="showLabel(option)"
                      :value="option">
                      <span>{{ showLabel(option) }}</span>
                      <p v-if="toolTipContent(option)" style="color: #8492a6; font-size: 13px">{{ toolTipContent(option) }}</p>
          </el-option>
      </el-select>
      <el-checkbox-group
        v-else
        v-model="vmodel[strucData.id]"
        :disabled="strucData.readonly">
        <el-checkbox v-for="(option, optionIndex) in optionList" :key="optionIndex" :label="option" :name="strucData.id">{{option[strucData.value.source.res.show_key[0]]}}</el-checkbox>
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
      headerTable: { type: Boolean },
      isEditing: { type: Boolean }
    },
    data () {
      return {
        optionList: [],
        limitNum: 0,
        limitMaxNum: 0,
        showToolTip: false,
        showOptionList: [],
        keyPaths: []
      }
    },
    created () {
      // if (this.strucData.value.source.res.show_key.length <= 1) {
      //   this.showToolTip = true
      // }
      this.keyPaths = []
      for (const para of this.strucData.value.source.data.params) {
        let keyPath
        if (para.value.key_path) {
          keyPath = para.value.key_path.split('.')
          this.keyPaths.push(para.value.key_path.split('.')[0])
          if (para.value.type === 'form_header') {
            this.$watch('whole.header.' + keyPath[0], (newVal, oldVal) => {
              if (!this.isEditing) {
                if (this.strucData.value.type === 'dicts') {
                  this.vmodel[this.strucData.id] = []
                } else {
                  this.vmodel[this.strucData.id] = null
                }
              }
              //  else {
              //   this.vmodel[this.strucData.id] = null
              // }
              this.renderOptions()
            }, { deep: true })
          } else if (para.value.type === 'form_body') {
            if (this.bodyTable || this.headerTable) {
              this.$watch('whole.' + keyPath[0], (newVal, oldVal) => {
                if (!this.isEditing) {
                  if (this.strucData.value.type === 'dicts') {
                    this.vmodel[this.strucData.id] = []
                  } else {
                    this.vmodel[this.strucData.id] = null
                  }
                }
                //  else {
                //   this.vmodel[this.strucData.id] = null
                // }
                this.renderOptions()
              }, { deep: true })
            } else {
              this.$watch('whole.body.' + this.index + '.' + para.value.key_path, (newVal, oldVal) => {
                if (!this.isEditing) {
                  // console.log('chongzhi?', this.vmodel[this.strucData.id], this.strucData.name, this.index)
                  if (this.strucData.value.type === 'dicts') {
                    this.vmodel[this.strucData.id] = []
                  } else {
                    this.vmodel[this.strucData.id] = null
                  }
                }
                //  else {
                //   this.vmodel[this.strucData.id] = null
                // }
                this.renderOptions()
              })
            }
          }
        }
      }
      // console.log(keyPaths)
      if (this.strucData.watch && typeof this.strucData.watch === 'string') {
        this.$watch('vmodel.' + this.strucData.watch, (newVal, oldVal) => {
          if (!this.isEditing) {
            if (this.strucData.value.type === 'dicts') {
              this.vmodel[this.strucData.id] = []
            } else {
              this.vmodel[this.strucData.id] = null
            }
          }
          if (!this.keyPaths.includes(this.strucData.watch)) {
            this.renderOptions()
          }
        }, { deep: true })
      } else {
        this.renderOptions()
      }
      // // 配置默认值
      // if (this.strucData.default && this.strucData.default.type) {
      //   if (this.strucData.default.type === 'form_body') {
      //     this.$watch('whole.body.' + this.index + '.' + this.strucData.default.key_path, (newVal, oldVal) => {
      //       this.whole.body[this.index][this.strucData.id] = newVal
      //     }, { deep: true })
      //   }
      // }
    },
    // 这个 watch 是为了上传Excel文档时，填入对应的值
    watch: {
      'vmodel': {
        handler: 'renderData',
        deep: true
      }
    },
    methods: {
      filterList (query) {
        // console.log(query)
        if (query !== '') {
          let arr = this.optionList.filter((val) => {
            return this.showLabel(val).indexOf(query) > -1
          })
          this.showOptionList = arr.slice(0, 50)
          // console.log(this.showOptionList)
        } else {
          this.showOptionList = this.optionList.slice(0, 50)
          // console.log(this.showOptionList)
        }
      },
      renderData () {
        setTimeout(() => {
          // 将默认值(对象类型)放回值里面
          if (
            this.vmodel[this.strucData.id]) {
            if (Array.isArray(this.vmodel[this.strucData.id])) {
              this.vmodel[this.strucData.id].map((item, itemindex) => {
                if (item[this.strucData.value.source.res.show_key[0]]) {
                  this.optionList.map(option => {
                    if (option[this.strucData.value.source.res.show_key[0]] === item[this.strucData.value.source.res.show_key[0]]) {
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
                let isIncludes
                for (var option of this.optionList) {
                  if (option[this.strucData.value.source.res.show_key[0]] === this.vmodel[this.strucData.id][this.strucData.value.source.res.show_key[0]]) {
                    this.vmodel[this.strucData.id] = option
                    isIncludes = true
                    return false
                  }
                }
                setTimeout(() => {
                  if (!isIncludes) {
                    if (!this.optionList.includes(this.vmodel[this.strucData.id])) {
                      this.optionList.push(this.vmodel[this.strucData.id])
                    }
                  }
                }, 100)
              }
            }
          }
        }, 100)
      },
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
        if (!this.strucData.value.source) {
          this.$message({
            showClose: true,
            message: `${this.strucData.name}的表单配置信息不完整`,
            duration: 0,
            type: 'error'
          })
          return false
        }
        function isRender (result) {
          if (result === '' || result === undefined || result === false) {
            return false
          } else { // null 和 0 发送请求
            return true
          }
        }
        let params = {}
        if (this.strucData.value.source.data.params.length !== 0) {
          // console.log(this.strucData.name)
          for (const para of this.strucData.value.source.data.params) {
            // console.log(para.value.type)
            if (para.value.type === 'static') {
              params[para.id] = para.value.value
            } else if (para.value.type === 'form_header') {
              if (this.whole && isRender(this.getPathResult(this.whole.header, para.value.key_path))) {
                // 这里要区分一下 this.whole.header 的 id 的值是对象还是数组, 数组的话，getPathResult 还有一个参数 k
                params[para.id] = this.getPathResult(this.whole.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'form_body') {
              if (this.bodyTable || this.headerTable) {
                if (isRender(this.getPathResult(this.whole, para.value.key_path))) {
                  // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                  params[para.id] = this.getPathResult(this.whole, para.value.key_path)
                } else {
                  return false // 如果没取到值就不发请求
                }
              } else {
                const keyPath = para.value.key_path.split('.')
                if (keyPath.length && !this.getPathResult(this.whole.body[this.index], keyPath[0])) {
                  return false
                }
                console.log(this.whole, this.index, para.value.key_path)
                if (this.whole && isRender(this.getPathResult(this.whole.body[this.index], para.value.key_path))) {
                  // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                  params[para.id] = this.getPathResult(this.whole.body[this.index], para.value.key_path)
                  // console.log(this.strucData.name, params[para.id])
                } else {
                  return false // 如果没取到值就不发请求
                }
              }
            } else if (para.value.type === 'message_header') {
              if (this.message && isRender(this.getPathResult(this.message.header, para.value.key_path))) {
                // 这里要区分一下 this.message.header 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'message_body') {
              // console.log(this.getPathResult(this.message.body[this.index], para.value.key_path, 0))
              if (this.message && isRender(this.getPathResult(this.message.body[this.index], para.value.key_path, 0))) {
                // 这里要区分一下 this.message.body[this.index] 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.body[this.index], para.value.key_path, 0)
              } else {
                this.$message.warning(`取不到 message_body 里的 ${para.value.key_path} 值`)
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
        // 如果没有设置action或者method，不发请求
        if (!postHeadvData.action || !postHeadvData.method) {
          this.optionList = []
          if (this.vmodel[this.strucData.id]) {
            this.optionList.push(this.vmodel[this.strucData.id])
          }
          return false
        }
        this.http.post(this.strucData.value.source.url.substring(4), postHeadvData)
        .then((response) => {
          this.optionList = this.getPathResult(response, this.strucData.value.source.res.data_path)
          this.filterList('')
          if (this.optionList.length === 0 && !this.isAlias) {
            this.vmodel[this.strucData.id] = null
          }
          // this.isEditing 编辑状态下不配置默认值
          if (this.strucData.default && this.strucData.default.type && !this.isEditing) {
            if (this.strucData.default.type === 'api') {
              if (Array.isArray(this.vmodel[this.strucData.id])) {
                let keyData
                if (this.strucData.limit.type === 'message_body') {
                  keyData = this.getPathResult(this.message.body[this.index], this.strucData.limit.key_path)
                } else if (this.strucData.limit.type === 'message_header') {
                  // console.log(this.message)
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
                  if (this.tableIndex) tableIndex = +this.tableIndex
                  if (this.index) {
                    optionIndex = this.index + tableIndex
                  } else {
                    optionIndex = tableIndex
                  }
                }
                const selectedIndex = optionIndex + +this.strucData.default.value
                if (selectedIndex < this.optionList.length) {
                  this.vmodel[this.strucData.id] = this.optionList[selectedIndex]
                  return false
                } else if (this.optionList[0]) {
                  this.$message.warning(`${this.strucData.name}的选项不够${selectedIndex}项`)
                  this.vmodel[this.strucData.id] = this.optionList[0]
                  return false
                } else {
                  this.$message.warning(`${this.strucData.name}无数据`)
                }
              }
            } else if (this.strucData.default.type === 'static') {
              for (const option of this.optionList) {
                if (option[this.strucData.value.source.res.show_key[0]] === this.strucData.default.value) {
                  if (this.strucData.value.type === 'dicts') {
                    this.vmodel[this.strucData.id].push(option)
                  } else {
                    this.vmodel[this.strucData.id] = option
                  }
                  return
                }
              }
            }
          }
          // 若有其他默认值的情况下，把值返回来
          if (this.strucData.value.type === 'dicts' && this.vmodel[this.strucData.id].length) {
            this.vmodel[this.strucData.id].map((item, itemindex) => {
              this.optionList.map(option => {
                if (option[this.strucData.value.source.res.show_key[0]] === item[this.strucData.value.source.res.show_key[0]]) {
                  this.vmodel[this.strucData.id].splice(itemindex, 1, option)
                }
              })
            })
          }
          if (this.strucData.value.source.data.action === 'users/all' && !this.isEditing) {
            // let userlist = []
            // this.optionList.map(list => {
            //   if (userlist.some(item => { return item.label === list.groups[0].key })) {

            //   }
            // })
            if (this.strucData.default && this.strucData.default.type) {
              if (this.strucData.default.type === 'static' && this.strucData.default.value === '$author') {
                const user = this.$store.state.userinfo.userId
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
          } else if (this.strucData.value.source.data.action === 'object/instance/list' && params.object_id === 'USER' && !this.isEditing) {
            if (this.strucData.default.type) {
              if (this.strucData.default.type === 'static' && this.strucData.default.value === '$author') {
                const user = this.$store.state.userinfo.userId
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
          }
          this.renderData()
        })
      }
    }
  }
</script>
