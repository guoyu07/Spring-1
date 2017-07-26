<template>
  <div>
    <!-- <template v-for="header in formData">
      <template v-for="value in header.value"> -->
    <el-form-item
       v-if="formData.value.type === 'table'"
      :prop="prop(formData)"
      :rules="rules(formData)"
      class="block">
      <el-button size="mini" @click="addTab(formData)" icon="plus" class="margin-bottom">{{formData.name}}</el-button>
      <el-tabs v-model="tabsValue" type="card" @tab-remove="removeTab(formData.id)">
        <el-tab-pane
          v-for="(table, tableindex) in item[formData.id]" :label="formData.name + (tableindex + 1)"
          :closable="item[formData.id].length > 1">
          <!-- :closable="closableIndex(tableindex, formData) -->
          <span v-for="formItem in formData.value.attr_list">
            <form-body
              :item="table"
              :form-item="formItem"
              :whole="postForm.header[formData.id][tableindex]"
              :wholeName="postFormName"
              :table-index="tableindex"
              :header-table="true"
              :value-id="formData.id"
              :message="messageData">
            </form-body>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
  </div>
</template>

<script>
  import formBody from './_formBody'
  export default {
    props: {
      item: { type: Object },
      formData: { type: Object },
      postForm: { type: Object },
      messageData: { type: Object },
      postFormName: { type: String }
    },

    data () {
      return {
        tabsValue: '0',
        limitTable: 0,
        limitTableMax: 0
      }
    },
    created () {

    },

    methods: {
      prop (value) {
        if (value.required) {
          return 'header.' + value.id
        } else {
          return ''
        }
      },
      tableValid (formItem) {
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
      },
      // closableIndex (index, value) {
      //   if (value.limit.type === 'static') {
      //     return (index + 1) > value.limit.min
      //   }
      // },
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
          // this.$message.warning(`最多只能增加${value.limit.max}个设备！`)
          if (value.limit.max) {
            this.$message.warning(`最多只能增加${value.limit.max}个${value.name}！`)
          } else {
            this.$message.warning(`不能再增加！`)
          }
        }
        // this.$refs['instockForm'].validate((valid) => {
          // if (valid) {
          //   if (this.item[value.id].length < this.form.body.count.max) {
          //     this.item[value.id].push(newData)
          //     this.tabsValue = this.item[value.id].length - 1 + ''
          //   } else {
          //     this.$message.warning(`最多只能增加${value.limit.max}个设备！`)
          //   }
          // } else {
          //   this.$message.warning('请填写完整后再增加！')
          //   return false
          // }
        // })
      }
    },

    components: {
      formBody
    }
  }
</script>
<style>
  .blockElement {
    width: 100%;
    display: flex!important;
  }
  .blockElement .el-form-item__content {
    width: 50%;
    width:-moz-calc(100% - 100px);
    width:-webkit-calc(100% - 100px);
    width: calc(100% - 100px);
  }
  .margin-bottom {
    margin-bottom: 8px;
  }
</style>
