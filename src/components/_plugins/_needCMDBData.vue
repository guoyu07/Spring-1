<template>
  <div>
    <template v-if="strucData.value.type === 'dict'">
      <template v-if="strucData.readonly">
        <el-input
          :placeholder="showLabel(vmodel[strucData.id])"
          :disabled="true">
        </el-input>
      </template>
      <template v-if="!strucData.readonly" >
        <template v-if="!strucData.isAlias">
          <el-select
            class="seeDescription"
            v-if="optionList.length > 1"
            v-model="vmodel[strucData.id]"
            clearable
            :allow-create="strucData.value.allow_create"
            filterable
            remote
            :remote-method="filterList"
            >
              <el-option  v-for="(option, index) in showOptionList"
                          :key="index"
                          :label="showLabel(option)"
                          :value="option">
                          <span>{{ showLabel(option) }}</span>
                          <p style="color: #8492a6; font-size: 13px">{{ toolTipContent(option) }}</p>
              </el-option>
          </el-select>
          <el-select
            class="seeDescription"
            v-else
            v-model="vmodel[strucData.id]"
            clearable
            :allow-create="strucData.value.allow_create"
            filterable
            >
              <el-option  v-for="(option, index) in optionList"
                          :key="index"
                          :label="showLabel(option)"
                          :value="option">
                          <span>{{ showLabel(option) }}</span>
                          <p style="color: #8492a6; font-size: 13px">{{ toolTipContent(option) }}</p>
              </el-option>
          </el-select>
        </template>
        <el-radio-group
          v-else
          v-model="vmodel[strucData.id]"
          :disabled="strucData.readonly">
          <el-radio v-for="(option, optionIndex) in optionList" :key="optionIndex" :label="option">{{option[strucData.value.source.res.show_key[0]]}}</el-radio>
        </el-radio-group>
      <div  v-if="showDescription && showOptionList.length === 1" class="showDescription" >
      {{showOptionList[0].describ}}
      </div>
      <!-- <a v-if="showHref" ><a/> -->
      </template>
    </template>
    <template v-else-if="strucData.value.type === 'dicts'">
      <el-select
        filterable
        remote
        :remote-method="filterList"
        v-if="!strucData.isAlias"
        v-model="vmodel[strucData.id]"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        multiple>
          <el-option  v-for="(option, optionIndex) in showOptionList"
                      :key="optionIndex"
                      :label="showLabel(option)"
                      :value="option">
                      <div class="left-content">
                        <span>{{ showLabel(option) }}</span>
                        <p v-if="toolTipContent(option)">{{ toolTipContent(option) }}</p>
                      </div>
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
      isEditing: { type: Boolean },
      tempSave: { type: Boolean }
    },
    data () {
      return {
        optionList: [],
        limitNum: 0,
        limitMaxNum: 0,
        showToolTip: false,
        showOptionList: [],
        keyPaths: [],
        params: {},
        prevMessage: true
      }
    },
    created () {
      let Deduplication = []
      this.keyPaths = []
      // watch 其他项进行请求
      for (const para of this.strucData.value.source.data.params) {
        if (para.value.key_path) {
          this.keyPaths.push(para.value.key_path.split('.')[0])
          let key = para.value.type + para.value.key_path.split('.')[0]
          if (Deduplication.indexOf(key) === -1) {
            Deduplication.push(para.value.type + para.value.key_path.split('.')[0])
          } else { return false }
          if (para.value.type === 'form_header') {
            this.$watch('whole.header.' + para.value.key_path, (newVal, oldVal) => {
              if (!this.isEditing && !this.vmodel[this.strucData.id]) {
                this.setDataType(this.strucData, this.vmodel)
              }
              if (oldVal !== undefined) {
                this.vmodel[this.strucData.id] = ''
                this.showOptionList = []
                this.optionList = []
              }
              this.renderOptions()
            })
          } else if (para.value.type === 'form_body') {
            if (this.bodyTable || this.headerTable) {
              this.$watch('whole.' + para.value.key_path, (newVal, oldVal) => {
                if (!this.isEditing && !this.vmodel[this.strucData.id]) {
                  this.setDataType(this.strucData, this.vmodel)
                }
                if (oldVal !== undefined) {
                  this.vmodel[this.strucData.id] = ''
                  this.showOptionList = []
                  this.optionList = []
                }
                this.renderOptions()
              })
            } else {
              this.$watch('whole.body.' + this.index + '.' + para.value.key_path, (newVal, oldVal) => {
                if (!this.isEditing && !this.vmodel[this.strucData.id]) {
                  this.setDataType(this.strucData, this.vmodel)
                  // console.log(this.vmodel[this.strucData.id], this.strucData.name)
                }
                if (oldVal) {
                  this.vmodel[this.strucData.id] = ''
                  this.showOptionList = []
                  this.optionList = []
                }
                this.renderOptions()
              })
            }
          }
        }
      }
      // typeof this.strucData.watch === 'string' 是为了兼容 firfox
      if (this.strucData.watch && typeof this.strucData.watch === 'string') {
        // console.log(!this.keyPaths.includes(this.strucData.watch), this.strucData.name)
        if (!this.keyPaths.includes(this.strucData.watch)) {
          this.$watch('vmodel.' + this.strucData.watch, (newVal, oldVal) => {
            if (!this.isEditing && !this.vmodel[this.strucData.id]) {
              this.setDataType(this.strucData, this.vmodel)
            }
            this.renderOptions()
          })
        }
      }
      this.renderOptions()
      // 监控上传Excel文档时或者有默认值或者驳回信息的值时，填入对应的值
      this.$watch('vmodel.' + this.strucData.id, (newVal, oldVal) => {
        this.rightForm(newVal, this.strucData.id)
        this.renderData()
      }, { deep: true })
    },
    watch: {
      // 'vmodel': { // 监控上传Excel文档时或者有默认值或者驳回信息的值时，填入对应的值
      //   handler: 'renderData',
      //   deep: true
      // },
      'optionList': { // 监控数据加载
        handler: 'renderData',
        deep: true
      }
    },
    computed: {
      showHref () {
        return this.params.object_id === 'ipaddr'
      },
      showDescription () {
        return this.params.object_id === 'activitiHostType'
      }
    },
    methods: {
      // 配置了默认值，可是为空返回格式不对
      rightForm (value, id) {
        if (!value && this.strucData.value.type === 'dicts') {
          this.vmodel[id] = []
        }
      },
      filterList (query) {
        // console.log(query)
        if (query || query === 0) {
          // 这里应该是query !=='' && query !== undefined && query !== null
          let arr = this.optionList.filter((val) => {
            // if (Array.isArray(query) && query.length) {
            //   return query.indexOf(this.showLabel(val)) > -1
            // } else
            if (typeof this.showLabel(val) === 'number') {
              // return this.showLabel(val) === query
              const value = this.showLabel(val) + ''
              return value.indexOf(query + '') > -1
            } else {
              // console.log(this.showLabel(val), val)
              return this.showLabel(val).indexOf(query) > -1
            }
          })
          this.showOptionList = arr.slice(0, 50)
        } else {
          this.showOptionList = this.optionList.slice(0, 50)
        }
        Array.isArray(this.vmodel[this.strucData.id]) && this.vmodel[this.strucData.id].map(val => {
          if (!this.showOptionList.find(option => { return option[this.strucData.value.source.res.show_key[0]] === val[this.strucData.value.source.res.show_key[0]] })) {
            this.showOptionList.unshift(val)
          }
        })
      },
      renderData (newVal, oldVal) {
        if (this.vmodel[this.strucData.id]) {
          // type 为 dicts 时
          if (Array.isArray(this.vmodel[this.strucData.id])) {
            this.filterList('')
            this.vmodel[this.strucData.id].map((item, itemindex) => {
              if (item[this.strucData.value.source.res.show_key[0]]) {
                this.optionList.map(option => {
                  if (option[this.strucData.value.source.res.show_key[0]] === item[this.strucData.value.source.res.show_key[0]]) {
                    // item = option
                    this.vmodel[this.strucData.id][itemindex] = option
                    // this.showOptionList.map(showOption => {
                    //   if (showOption[this.strucData.value.source.res.show_key[0]] !== item[this.strucData.value.source.res.show_key[0]]) {
                    //     this.showOptionList.push(option)
                    //   }
                    // })
                   // showlist一开始没包含option暂时直接push
                    this.showOptionList.push(option)
                  } else {
                    if (!this.optionList.includes(item)) {
                      this.optionList.push(item)
                      this.filterList(this.showLabel(this.vmodel[this.strucData.id]))
                    }
                  }
                })
              }
            })
          } else { // type 为 dict 时
            this.filterList(this.showLabel(this.vmodel[this.strucData.id]))
            if (this.vmodel[this.strucData.id][this.strucData.value.source.res.show_key[0]]) {
              let isIncludes = false
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
                    this.filterList(this.showLabel(this.vmodel[this.strucData.id]))
                  }
                }
              }, 100)
            }
          }
        } else {

        }
      },
      showLabel (option) { // 显示 show_key 的信息
        if (Array.isArray(this.strucData.value.source.res.show_key)) {
          // type 为 dicts 时
          if (Array.isArray(option)) {
            let arr = option.map((val) => {
              return val[this.strucData.value.source.res.show_key[0]]
            })
            return arr
          } else if (option) { // type 为 dict 时
            return option[this.strucData.value.source.res.show_key[0]]
          }
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
              // console.log(this.bodyTable, this.headerTable, this.strucData.name)
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
                // console.log(this.whole, this.index, para.value.key_path)
                if (this.whole && isRender(this.getPathResult(this.whole.body[this.index], para.value.key_path))) {
                  // 这里要区分一下 this.whole.body[this.index] 的 id 的值是对象还是数组
                  params[para.id] = this.getPathResult(this.whole.body[this.index], para.value.key_path)
                  // console.log(this.strucData.name, params[para.id])
                } else {
                  return false // 如果没取到值就不发请求
                }
              }
            } else if (para.value.type === 'message_header') {
              if (this.message && (isRender(this.getPathResult(this.message.header, para.value.key_path)) || isRender(this.getPathResult(this.message.header, para.value.key_path, 0)))) {
                // 这里要区分一下 this.message.header 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.header, para.value.key_path, 0) || this.getPathResult(this.message.header, para.value.key_path)
              } else {
                return false // 如果没取到值就不发请求
              }
            } else if (para.value.type === 'message_body') {
              // console.log(this.getPathResult(this.message.body[this.index], para.value.key_path, 0))
              if (this.message && (isRender(this.getPathResult(this.message.body[this.index], para.value.key_path)) || isRender(this.getPathResult(this.message.body[this.index], para.value.key_path, 0)))) {
                // 这里要区分一下 this.message.body[this.index] 的 id 的值是对象还是数组
                params[para.id] = this.getPathResult(this.message.body[this.index], para.value.key_path, 0) || this.getPathResult(this.message.body[this.index], para.value.key_path)
              } else {
                this.$message.warning(`取不到 message_body 里的 ${para.value.key_path} 值`)
                return false // 如果没取到值就不发请求
              }
            }
          }
        }
        this.params = params
        const postHeadvData = {
          action: this.strucData.value.source.data.action,
          method: this.strucData.value.source.data.method,
          data: params
        }
        // // 如果是有缓存复制的新表就不发请求直接拿缓存
        // if (this.index !== 0 && this.tempSave === true) {
        //   this.showOptionList = JSON.parse(window.sessionStorage.getItem(`body.0.${this.strucData.id}`))
        //   return false
        // }
        // 如果没有设置action或者method，不发请求
        if (!postHeadvData.action || !postHeadvData.method) {
          this.optionList = []
          // 数组的情况下和对象的情况要分开
          if (Array.isArray(this.vmodel[this.strucData.id])) {
            this.vmodel[this.strucData.id].forEach((val) => {
              this.optionList.push(val)
            })
            this.showOptionList = this.optionList
          } else if (this.vmodel[this.strucData.id]) {
            this.optionList.push(this.vmodel[this.strucData.id])
            this.showOptionList = this.optionList
          }
          return false
        }
        this.http.post(this.strucData.value.source.url.substring(4), postHeadvData)
        .then((response) => {
          if (response) {
            this.optionList = this.getPathResult(response, this.strucData.value.source.res.data_path)
            if (this.optionList.length === 0) {
              this.$message.info(`${this.strucData.name}无数据`)
              if (!this.isAlias) {
                this.vmodel[this.strucData.id] = null
              }
            }
            // 缓存
            // if (this.index === 0 && this.tempSave === true) {
            //   window.sessionStorage.setItem(`body.${this.index}.${this.strucData.id}`, JSON.stringify(this.optionList))
            // }
            this.filterList('')
            // this.vmodel[this.strucData.id] 有值时不配置默认值，编辑状态下是会配置默认值的
            if (this.strucData.default && this.strucData.default.type && !this.vmodel[this.strucData.id]) {
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
                  if (this.optionList.length === 0) {
                    this.$message.warning(`${this.strucData.name}无数据`)
                  } else if (selectedIndex < this.optionList.length) {
                    this.vmodel[this.strucData.id] = this.optionList[selectedIndex]
                    // console.log(this.strucData.name, this.vmodel[this.strucData.id])
                    return false
                  } else if (this.optionList.length) {
                    this.$message.warning(`${this.strucData.name}的选项不够${selectedIndex + 1}项`)
                    this.vmodel[this.strucData.id] = this.optionList[this.optionList.length - 1]
                    return false
                  }
                }
              } else if (this.strucData.default.type === 'static') {
                // 若识别不到则置空
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
            if (this.strucData.value.type === 'dicts' && this.vmodel[this.strucData.id] && this.vmodel[this.strucData.id].length) {
              this.vmodel[this.strucData.id].map((item, itemindex) => {
                this.optionList.map(option => {
                  if (option[this.strucData.value.source.res.show_key[0]] === item[this.strucData.value.source.res.show_key[0]]) {
                    this.vmodel[this.strucData.id].splice(itemindex, 1, option)
                  }
                })
              })
            }
            if (this.strucData.value.source.data.action === 'users/all' && !this.isEditing) {
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
            } else if (this.strucData.value.source.data.action === 'object/instance/list' && this.params.object_id === 'USER' && !this.isEditing) {
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
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .seeDescription {
    &:hover + .showDescription{
      display:block;
    }
  }
  .showDescription {
    position: absolute;
    width: 200px;
    display: none;
    font-size: 12px;
    line-height: 1;
    padding-top: 16px;
    z-index:100;
    background:#fff;
  }
  .left-content {
    float: left;
    overflow: hidden;
    width: 100%;
    p {
      width: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      color: #8492a6;
      font-size: 13px
    }
  }
</style>
