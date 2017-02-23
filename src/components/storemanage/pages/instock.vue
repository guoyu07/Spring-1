<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24">
        <el-card class="box-card">
          <h3>入库流程</h3>
          <el-form label-position="left" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="renderFormData">
                <el-radio v-for="device in deviceList" :label="device">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="step step-2">
            <el-form label-position="top" :inline="true" ref="instockForm" :model="instockForm">
              <el-button size="small" @click="onAdd('instockForm')" class="margin-bottom" icon="plus">增加</el-button>
              <el-tabs type="card" closable @tab-click="handleClick" @tab-remove="handleRemove">
                <el-tab-pane  v-for="(item, index) in instockForm.data" :key="item.id" :label="'设备' + (index + 1)">
                  <div class="form-block" v-for="formBlcok in formData">
                    <h4>{{formBlcok.name}}</h4>
                    <el-form-item
                      v-for="formItem in formBlcok.value"
                      :prop="'data.' + index + '.' + formItem.id"
                      :label="formItem.name"
                      :rules="{
                        type: (formItem.value.type === 'arr' || formItem.value.type === 'FKs') ? 'array' : (formItem.value.type === 'int' ? 'number' : 'string'), required: formItem.required === 'true', message: formItem.name + '不能为空', trigger: 'blur'
                      }">
                      <el-input
                        v-if="formItem.value.type === 'str'"
                        v-model="item[formItem.id]">
                      </el-input>

                      <el-input-number
                        v-else-if="formItem.value.type === 'int'"
                        v-model="item[formItem.id]" :min="0">
                      </el-input-number>

                      <el-select
                        v-else-if="formItem.value.type === 'enum'"
                        v-model="item[formItem.id]">
                        <el-option v-for="option in formItem.value.regex"
                          :label="option"
                          :value="option"></el-option>
                      </el-select>

                      <el-select
                        v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'"
                        v-model="item[formItem.id]"
                        :multiple="formItem.value.type === 'FKs'">
                        <el-option v-for="option in formItem.value.object_list"
                          :label="option.name"
                          :value="option.instanceId"></el-option>
                      </el-select>

                      <el-select
                        v-else-if="formItem.value.type === 'arr'"
                        v-model="item[formItem.id]"
                        multiple
                        filterable=""
                        allow-create>
                        <el-option value="">请创建</el-option>
                      </el-select>

                      <el-date-picker
                        v-else="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
                        v-model="item[formItem.id]"
                        :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
                        placeholder="选择日期时间">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form>
            <el-button type="primary" class="margin-top" @click="onConfirm('instockForm')">确认</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        deviceType: {},
        instockForm: {
          data: [{}]
        },
        deviceList: [],
        formData: {},
        deviceSearch: '',
        deviceTable: [],
        deviceViewData: {
          visible: false,
          device: {}
        },
        validateIP: (rule, value, cb) => {
          const reg = /^(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])$/
          if (value && !value.match(reg)) {
            cb(new Error('请输入正确的IP地址'))
          }
        }
      }
    },
    created () {
      this.renderDeviceList()
      this.renderFormData()
    },
    methods: {
      renderDeviceList () { // 渲染设备类型
        var renderDeviceListData = {
          action: 'import/device/items',
          method: 'GET',
          data: {}
        }
        this.http.post('custom/', this.parseData(renderDeviceListData)).then((res) => {
          console.log(res)
          this.deviceList = res.data.data.list
          this.deviceType = this.deviceList[0]
        })
      },
      renderFormData () { // 渲染表单数据
        const renderFromData = {
          action: 'cmdb/object/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType.object_id
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.formData = res.data.data.attr_group
          this.formData.map(group => {
            group.value.map(item => {
              if (item.value.type === 'arr' || item.value.type === 'FKs') {
                this.$set(this.instockForm.data[0], item.id, [])
              } else if (item.value.type === 'int') {
                this.$set(this.instockForm.data[0], item.id, 0)
              } else {
                this.$set(this.instockForm.data[0], item.id, '')
              }
            })
          })
        })
      },
      handleRemove (tab) {
        this.instockForm.data.splice(tab.index, 1)
        // console.log(tab.index, this.instockForm.data)
      },
      handleClick (tab, event) {
        // console.log(tab.index, tab, event)
      },
      onAdd (formName) {
        let newData = {}
        this.formData.map(group => {
          group.value.map(item => {
            if (item.value.type === 'arr' || item.value.type === 'FKs') {
              newData[item.id] = []
            } else if (item.value.type === 'int') {
              newData[item.id] = 0
            } else {
              newData[item.id] = ''
            }
          })
        })
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.instockForm.data.length < 10) {
              this.instockForm.data.push(newData)
            } else {
              this.$message.warning('最多只能增加 10 个设备！')
            }
          } else {
            this.$message.warning('请填写完整后再增加')
            return false
          }
        })
      },
      onConfirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!')
            const postData = {
              action: 'runtime/process/instances',
              method: 'POST',
              data: {
                pkey: this.deviceType.pkey,
                form: {
                  'object_list': this.instockForm.data,
                  'object_id': this.deviceType.object_id
                }
              }
            }
            this.http.post('', this.parseData(postData)).then((res) => {
              console.log(res)
              this.$router.replace('/')
              this.$message.warning('提交成功！')
            })
          } else {
            console.log('error submit!!')
            this.$message.warning('表单未填写完整，提交失败！')
            return false
          }
        })
      }
    },

    components: {
      // deviceView
    }
  }
</script>

<style lang="less" scoped>
  .el-select, .el-input-number, .el-input, .el-date-editor.el-input {
    width: 187px;
  }
  .form-title {
    margin-bottom: 15px;
  }
  .margin-top {
    margin-top: 15px;
  }
  .margin-bottom {
    margin-bottom: 15px;
  }
  .instock-card {
    margin-bottom: 15px;
    position: relative;
  }
  .instock-card-remove {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 28px;
    color: #ff4949;
  }
</style>
