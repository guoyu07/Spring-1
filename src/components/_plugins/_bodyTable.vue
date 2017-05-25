<template>
  <div>
    <!-- <template v-for="bodylist in formData">
      <template v-for="value in bodylist.value">
        <template v-if="value.value.type === 'table'"> -->
    <el-form-item
      v-if="formData.value.type === 'table'"
      :prop="prop(formData)"
      :rules="rules(formData)"
      class="block">
      <!-- formData.limit.type === 'static' || !formData.limit.type 这2种情况是允许增加 table 的 -->
      <el-button v-if="formData.limit.type === 'static' || !formData.limit.type" size="mini" @click="addTab(formData)" icon="plus" class="margin-bottom">{{formData.name}}</el-button>
      <el-tabs v-model="tabsValue" type="card" @tab-remove="removeTab(formData.id)">
        <el-tab-pane
          v-for="(table, tableindex) in item[formData.id]" :label="formData.name + (tableindex + 1)"
          :closable="closableIndex(tableindex, formData)">
          <form-structure
            :form-data="[{name: '', value: formData.value.attr_list}]"
            :item="table"
            :whole="postForm.body[index][formData.id][tableindex]"
            :message="messageData"
            :index="index"
            :table-index="tableindex"
            :body-table="true"
            :value-id="formData.id">
          </form-structure>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
          <!--
        </template>
      </template>
    </template> -->
  </div>
</template>

<script>
  import formStructure from './_formStructure'
  export default {
    props: {
      item: { type: Object },
      postForm: { type: Object },
      messageData: { type: Object },
      formData: { type: Object },
      index: { type: Number }
    },

    data () {
      return {
        tabsValue: '0',
        limitNum: 0,
        limitTableMax: 0
      }
    },
    created () {
      // console.log(this.formData)
    },

    watch: {
      'limitNum': 'renderTable'
    },

    methods: {
      prop (value) {
        if (value.required) {
          return 'body.' + this.index + '.' + value.id
        } else {
          return ''
        }
      },
      renderTable () { // 这里是控制一开始的固定table个数，最少的table个数或者是固定的table个数
        for (let i = 0; i < this.limitNum; i++) {
          if (this.postForm.body[this.index][this.formData.id].length < this.limitNum) {
            this.postForm.body[this.index][this.formData.id].push(this.postForm.body[this.index][this.formData.id][0])
          }
          // 配置默认值
          this.formData.value.attr_list.map(list => {
            if (list.default.type) {
              if (list.default.type === 'message_header') {
                // 如果原值不是数组，而默认值取到一个数组，则按 table 的索引来取默认值
                if (!Array.isArray(this.postForm.body[this.index][this.formData.id][i][list.id]) && Array.isArray(this.getPathResult(this.messageData.header, list.default.key_path))) {
                  this.postForm.body[this.index][this.formData.id][i][list.id] = this.getPathResult(this.messageData.header, list.default.key_path)[i]
                } else {
                  this.postForm.body[this.index][this.formData.id][i][list.id] = this.getPathResult(this.messageData.header, list.default.key_path)
                }
              }
            }
          })
        }
      },
      tableValid (formItem) {
        // console.log(formItem)
        let keyData
        if (formItem.limit.type === 'message_body') {
          keyData = this.getPathResult(this.message.body[this.index], formItem.limit.key_path)
        } else if (formItem.limit.type === 'message_header') {
          keyData = this.getPathResult(this.message.header, formItem.limit.key_path)
        } else if (formItem.limit.type === 'static') {
          keyData = formItem.limit.min
          this.limitTableMax = formItem.limit.max
        } else if (formItem.limit.type === 'form_body') {
          keyData = this.getPathResult(this.whole.body[this.index], formItem.limit.key_path) // this.whole.body[this.index] 就是 this.item
        } else if (formItem.limit.type === 'form_header') {
          keyData = this.getPathResult(this.whole.header, formItem.limit.key_path)
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
        // 以下是 formItem.limit.type 未配置时，或者 keyData 本身取到的值为 0 或者 取不到 对应的值，都默认为至少有一个 table 并且可增加无限个 table
        if (!this.limitNum) {
          this.limitNum = 1
        }
        var validateLimit = (rule, value, cb) => {
          function isMatch (ele, i, arr) {
            const reg = new RegExp(ele)
            return value.some(val => { return !val.match(reg) }) // 要value数组里每一个值都通过正则，否则报错
          }
          if (value && formItem.value.regex.length && formItem.value.regex.some(isMatch)) {
            return cb(new Error(`请输入正确的${formItem.name}`))
          }
          if (this.limitTableMax) { // static时，有一个范围值
            if (value.length < this.limitNum) {
              return cb(new Error(`至少需要${this.limitNum}个${formItem.name},还差${this.limitNum - value.length}个`))
            } else if (value.length > this.limitTableMax) {
              return cb(new Error(`至多可以增加${this.limitTableMax}个${formItem.name},请删除${value.length - this.limitTableMax}个`))
            } else {
              cb()
            }
          } else { // 除static外，其他都是一个固定的数值，不准多不准少
            if (value.length < this.limitNum) {
              return cb(new Error(`需要${this.limitNum}个${formItem.name},还差${this.limitNum - value.length}个`))
            } else if (value.length > this.limitNum) {
              return cb(new Error(`只需要${this.limitNum}个${formItem.name},请删除${value.length - this.limitNum}个`))
            } else {
              cb()
            }
          }
        }
        return {
          validator: validateLimit,
          required: formItem.required,
          trigger: 'blur, change'
        }
      },
      rules (formItem) {
        return this.tableValid(formItem)
        // if (formItem.value.type === 'dicts') {
        //   return this.tableValid(formItem)
        // } else if (formItem.value.type === 'dict') {
        //   return {
        //     type: 'object',
        //     required: formItem.required,
        //     message: formItem.name + '不能为空',
        //     trigger: 'blur, change'
        //   }
        // }
      },
      closableIndex (index, value) {
        if (value.limit.type === 'static') {
          // return !(value.limit.min > index && index < value.limit.max)
          return (index + 1) > value.limit.min
        }
      },
      removeTab (id) {
        let tabs = this.item[id]
        let activeName = this.tabsValue
        // if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          // if (index === +targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = tabs.indexOf(nextTab)
          }
          // }
        })
        // }
        this.tabsValue = activeName + ''
        this.item[id].splice(activeName + 1, 1)
        // this.instockForm.body = tabs.filter(tab => tab.name !== targetName)
      },
      addTab (value) {
        // let newTabName = ++this.tabIndex + ''
        let newData = {}
        // newData.tabname = newTabName
        value.value.attr_list.map(list => {
          // const i = this.item[value.id].length - 1
          // newData[list.id] = this.item[value.id][i][list.id]
          this.setNewDataType(list, newData)
        })
        // console.log(this.item[value.id].length, value.limit.max)
        if (this.item[value.id].length < value.limit.max) {
          this.item[value.id].push(newData)
          this.tabsValue = this.item[value.id].length - 1 + ''
        } else {
          this.$message.warning(`最多只能增加${value.limit.max}个设备！`)
        }
      }
    },

    components: {
      formStructure
    }
  }
</script>
<style>
  .block {
    width: 100%;
    border-bottom: 1px dashed #ccc;
    /*background-color: #f8f8f8;*/
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
  }
  .el-form-item .el-form-item {
    margin-bottom: 22px;
  }
  .margin-bottom {
    margin-bottom: 8px;
  }
</style>
