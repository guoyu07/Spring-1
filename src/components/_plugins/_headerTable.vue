<template>
  <div>
    <div v-for="header in formData">
      <div v-for="value in header.value">
        <div v-if="value.value.type === 'table'">
          <!-- <pre>{{value}}</pre> -->
          <el-button size="mini" @click="addTab(value)" icon="plus" class="margin-bottom">{{value.name}}</el-button>
          <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane v-for="(body, bodyindex) in item[value.id]" :label="value.name + (bodyindex + 1)">
              <!-- <pre>{{value.value.attr_list}}</pre> -->
              <form-structure
                :form-data="[{name: header.name, value: value.value.attr_list}]"
                :item="body"
                :index="0"
                :header-table="true"
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
      formData: { type: Array }
    },

    data () {
      return {
        tabsValue: '0'
      }
    },
    created () {

    },

    methods: {
      addTab (value) {
        // let newTabName = ++this.tabIndex + ''
        let newData = {}
        // newData.tabname = newTabName
        value.value.attr_list.map(list => {
          const i = this.item[value.id].length - 1
          newData[list.id] = this.item[value.id][i][list.id]
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
