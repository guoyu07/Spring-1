<template>
  <div class="editor-content">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-wpforms icon-lg color-primary"></i> 事件自定义</h3>
          <el-row>
            <el-col :sm="24" :md="20">
              <el-card class="box-card">
                <div class="corner-ribbon"><span>通用模块</span></div>
                <el-row class="form-block">
                  <h4>事件分类</h4>
                  <el-tag
                    type="primary"
                    :key="tag"
                    v-for="tag in this.componentList"
                    :closable="true"
                    :close-transition="false"
                    @close="onRemoveComponent(tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="addComponentData.isEditing"
                    v-model="addComponentData.value"
                    ref="addComponentInput"
                    size="mini"
                    @keyup.enter.native="onAddComponent"
                    @blur="addComponentData.isEditing = false"></el-input>
                  <el-button v-else class="button-new-tag" size="small" icon="plus" @click="onAttemptToAddComponent">新事件分类</el-button>
                </el-row>
                <el-row class="form-block" v-for="(module, name, index) in groupedGenericModuleMap" :key="index" v-if="name !== '通用'">
                  <h4>{{name}} <span v-show="!['概要', '工单信息', '人员', '描述', '附件'].includes(name)" class="el-icon-edit" @click="onEditGenericModuleName(name)"></span></h4>
                  <form-conf :config-data="module" :presets="presetList" :option-presets="optionPresets" :body-index="index" :category="name" @on-config-change="onGenericModuleChange"></form-conf>
                  <el-button class="button-del-mod" type="danger" size="small" icon="delete" @click="onDeleteGenericModule(name)"></el-button>
                </el-row>
                <el-row style="margin: 12px 0">
                  <el-button type="primary" size="small" icon="plus" @click="onAddGenericModule">通用模块</el-button>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="24" :md="20">
              <el-card class="box-card">
                <div class="corner-ribbon"><span>事件模块</span></div>
                <el-select
                  v-model="selectedComponent"
                  placeholder="请选择事件分类">
                  <el-option
                    v-for="comp in this.componentList"
                    :key="comp"
                    :label="comp"
                    :value="comp"></el-option>
                </el-select>
                <!-- <el-row class="form-block">
                  <h4>事件详情</h4>
                  <form-conf :config-data="eventDetailList" :presets="presetList"></form-conf>
                </el-row> -->
                <el-row class="form-block" v-for="(module, name, index) in groupedCustomModuleMap" :key="index">
                  <h4>{{name}} <span v-show="name !== '事件详情'" class="el-icon-edit" @click="onEditCustomModuleName(name)"></span></h4>
                  <form-conf :config-data="module" :presets="presetList" :option-presets="optionPresets" :body-index="index" :category="name" @on-config-change="onCustomModuleChange"></form-conf>
                  <el-button class="button-del-mod" type="danger" size="small" icon="delete" @click="onDeleteCustomModule(name)"></el-button>
                </el-row>
                <el-button v-if="selectedComponent" type="primary" size="small" icon="plus" @click="onAddCustomModule">事件模块</el-button>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-button type="warning" :plain="true" icon="fa-undo" @click="$router.go(-1)">取消</el-button> -->
            <el-button type="success" icon="fa-check" @click="onSubmitIncidentForm()">确认提交</el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import formConf from './../../forms/pages/_config/_formConf' // 借用表单配置的字段配置组件
  import getPresetList from './../../../mixins/getPresetList'
  import getOptionPresets from './../../../mixins/getOptionPresets'
  import _ from './../../../utils/_'
  // 历史遗留
  const newFieldData = {
    id: '',
    name: '新字段',
    category: '',
    unique: false,
    required: true,
    need_submit: true,
    readonly: false,
    isAlias: false,
    default: {
      type: '',
      value: '',
      id: '',
      key_path: ''
    },
    limit: {
      type: '',
      max: 0,
      min: 0,
      id: '',
      key_path: ''
    },
    value: {
      confVisible: false,
      regex: [],
      type: ''
    }
  }
  export default {
    mixins: [getPresetList, getOptionPresets],
    data () {
      return {
        pkey: 'incident',
        tkey: 'start',
        tname: '事件启动',
        incidentFormData: null,
        // incidentFormDataBuffer: '',
        submitting: false,
        componentList: [],
        addComponentData: {
          isEditing: false,
          value: ''
        },
        selectedComponent: ''
      }
    },
    computed: {
      // 待提交的表单数据
      submitFormData () {
        return {
          // tname: this.tname,
          tkey: this.tkey,
          form: this.incidentFormData,
          pkey: this.pkey
        }
      },
      // 符合当前事件分类的 body
      currentBody () {
        let result = null
        if (!this.incidentFormData) return null
        let bodyList = this.incidentFormData.form.body.body_list
        bodyList.forEach((body) => {
          if (body.name === this.selectedComponent) {
            result = body
          }
        })
        return result
      },
      // 事件详情
      // eventDetailList () {
      //   let result = []
      //   if (!this.incidentFormData || !this.currentBody) return result
      //   let category = '事件详情'
      //   this.currentBody.attr_list.forEach((attr) => {
      //     if (attr.category === category) {
      //       result.push(attr)
      //     }
      //   })
      //   return result
      // },
      // 模块映射集，以相同 category 值为键名
      groupedGenericModuleMap () {
        let result = []
        if (!this.incidentFormData) return result
        result = _._groupBy(this.incidentFormData.form.header, 'category')
        return result
      },
      groupedCustomModuleMap () {
        let result = []
        if (!this.incidentFormData || !this.currentBody) return result
        result = _._groupBy(this.currentBody.attr_list, 'category')
        return result
      }
    },
    created () {
      this.getIncidentForm()
      this.getPresetList()
      this.getOptionPresets()
    },
    methods: {
      getIncidentForm () {
        let { pkey, tkey } = this
        // 顶，有个接口是分好组的，不用自己 groupBy
        let postData = {
          action: 'process/form',
          method: 'GET',
          data: { pkey, tkey }
        }
        this.http.post('/form/', this.parseData(postData)).then((res) => {
          this.incidentFormData = res.data.data
          // this.incidentFormDataBuffer = JSON.stringify(this.incidentFormData)
          this.incidentFormData.form.header.find((attr) => {
            if (attr.id === 'components') {
              this.componentList = attr.value.regex
            }
          })
        })
      },
      onSubmitIncidentForm (message) {
        // 把 groupBy 好的数据转换回去
        if (this.currentBody) {
          this.currentBody.attr_list = _._reverseGroupBy(this.groupedCustomModuleMap, this.currentBody.attr_list)
        }
        this.incidentFormData.form.header = _._reverseGroupBy(this.groupedGenericModuleMap, this.incidentFormData.form.header)
        // console.log(this.currentBody.attr_list)
        // console.log(this.submitFormData)
        let postData = {
          action: 'process/form',
          method: 'POST',
          data: this.submitFormData
        }
        this.http.post('/form/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success(message)
            this.getIncidentForm()
            return true
          }
        })
      },
      onRemoveComponent (tag) {
        this.componentList.splice(this.componentList.indexOf(tag), 1)
        this.onSubmitIncidentForm('已移除！')
      },
      onAttemptToAddComponent () {
        this.addComponentData.isEditing = true
        this.$nextTick(_ => {
          this.$refs.addComponentInput.$refs.input.focus()
        })
      },
      onAddComponent () {
        let value = this.addComponentData.value
        if (value) {
          this.componentList.push(value)
        }
        // 自动新增「事件详情」模块
        this.incidentFormData.form.body.body_list.push({
          name: value,
          show: {
            key_path: 'components',
            op: 'eq',
            type: 'form_header',
            value
          },
          attr_list: [{
            ...newFieldData,
            ...{
              id: 'placeholder_field',
              category: '事件详情',
              value: {
                type: 'str',
                confVisible: false,
                regex: []
              }
            }
          }]
        })
        this.onSubmitIncidentForm('已添加！')
        this.addComponentData.isEditing = false
        this.addComponentData.value = ''
      },
      onEditGenericModuleName (name) {
        this.$prompt('修改通用模块标题：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value !== name) {
            let buffer = JSON.stringify(this.incidentFormData.form.header)
            buffer = buffer.replace(new RegExp(name, 'g'), value)
            // console.log(buffer)
            // this.$set(this.groupedCustomModuleMap, JSON.parse(buffer))
            this.incidentFormData.form.header = JSON.parse(buffer)
            // console.log(this.groupedCustomModuleMap)
          }
        })
      },
      onEditCustomModuleName (name) {
        this.$prompt('修改事件模块标题：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value !== name) {
            let buffer = JSON.stringify(this.currentBody.attr_list)
            buffer = buffer.replace(new RegExp(name, 'g'), value)
            // console.log(buffer)
            // this.$set(this.groupedCustomModuleMap, JSON.parse(buffer))
            this.currentBody.attr_list = JSON.parse(buffer)
            // console.log(this.groupedCustomModuleMap)
          }
        })
      },
      onAddGenericModule () {
        this.$prompt('请输入新模块标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.incidentFormData.form.header.push({ ...newFieldData, ...{ category: value } })
        })
      },
      onDeleteGenericModule (name) {
        this.$confirm(`此操作将删除通用模块「${name}」及其下所有字段，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$nextTick(() => {
            // 应该有更优雅的方式
            this.incidentFormData.form.header = this.incidentFormData.form.header.filter(_ => _.category !== name)
          })
        })
      },
      onAddCustomModule () {
        this.$prompt('请输入新模块标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.currentBody.attr_list.push({ ...newFieldData, ...{ category: value } })
        })
      },
      onDeleteCustomModule (name) {
        this.$confirm(`此操作将删除自定义模块「${name}」及其下所有字段，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$nextTick(() => {
            // 应该有更优雅的方式
            this.currentBody.attr_list = this.currentBody.attr_list.filter(_ => _.category !== name)
          })
        })
      },
      onGenericModuleChange (args) {
        console.log('received!')
        this.groupedGenericModuleMap[args.category] = args.val
      },
      onCustomModuleChange (args) {
        console.log('received!')
        this.groupedCustomModuleMap[args.category] = args.val
      }
    },
    components: {
      formConf
    }
  }
</script>
<style lang="less" scoped>
    @import url("./../../../assets/css/variables.less");
  .editor-content {

    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .options-btn {
      margin-bottom: 10px;
      float: right;
    }
    label {
      line-height: 36px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .input-new-tag {
      width: 97px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0
    }
    .button-del-mod {
      position: absolute;
      bottom: 12px;
      right: 12px;
    }
    .box-card {
      margin-bottom: 18px;
      position: relative;
    }
    .corner-ribbon {
      position: absolute;
      right: -5px;
      top: -5px;
      z-index: @floating;
      overflow: hidden;
      width: 75px;
      height: 75px;
      span {
        position: absolute;
        top: 19px;
        right: -21px;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        line-height: 20px;
        transform: rotate(45deg);
        width: 100px;
        display: block;
        background-color: @eoThemeColor;
        box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 100%;
          z-index: @underground;
          border-bottom: 3px solid transparent;
          border-top: 3px solid @eoThemeColor;
        }
        &::before {
          left: 0;
          border-left: 3px solid @eoThemeColor;
          border-right: 3px solid transparent;
        }
        &::after {
          right: 0;
          border-right: 3px solid @eoThemeColor;
          border-left: 3px solid transparent;
        }
      }
    }
  }
  .form-block {
    border-bottom: 2px dotted @borderColor;
    margin: 10px 0 20px;
    // background-color: @bgLighter;
    padding: 6px 12px 12px;
    h4 {
      color: @primary;
      position: relative;
      padding-left: 8px;
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: @primary;
        position: absolute;
        left: 0px;
        top: 10px;
      }
    }
    h5 {
      margin: 14px 0 10px;
      color: @textColor;
    }
  }
</style>
