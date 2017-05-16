<template>
  <div>
    <div v-for="bodylist in formData">
      <div v-for="value in bodylist.value">
        <div v-if="value.value.type === 'table'">
          <el-button size="mini" @click="addTab(value)" icon="plus" class="margin-bottom">{{value.name}}</el-button>
          <el-tabs v-model="tabsValue" type="card" @tab-remove="removeTab(value.id)">
            <el-tab-pane
              v-for="(table, tableindex) in item[value.id]" :label="value.name + (tableindex + 1)"
              :closable="closableIndex(tableindex, value)">
              <form-structure
                :form-data="[{name: bodylist.name, value: value.value.attr_list}]"
                :item="table"
                :index="index"
                :table-index="tableindex"
                :body-table="true"
                :value-id="value.id">
              </form-structure>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import formStructure from './_formStructure'
  export default {
    props: {
      item: { type: Object },
      formData: { type: Array },
      index: { type: Number }
    },

    data () {
      return {
        tabsValue: '0'
      }
    },
    created () {

    },

    methods: {
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
      formStructure
    }
  }
</script>
<style>
  .blockElement {
    width: 100%;
    display: flex;
  }
  .blockElement .el-form-item__content {
    width: 50%;
    width:-moz-calc(100% - 85px);
    width:-webkit-calc(100% - 85px);
    width: calc(100% - 85px);
  }
  .margin-bottom {
    margin-bottom: 8px;
  }
</style>
