<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-fa-server"></i>设备上架</h3>
          <div class="form-block">
            <h5>{{mainInfo.name}}</h5>
            <el-form ref="searchKeys" class="advance-search-form" :model="searchKeys" label-width="100px" :inline="true">
              <el-form-item v-for="search in searchKeyList" :label="search.name" :prop="search.id">
                <div class="form-unit">
                  <el-select
                    v-model="searchKeys[search.id].op"
                    size="small">
                    <el-option v-for="option in oplist"
                      :label="option.name"
                      :value="option.id">
                    </el-option>
                  </el-select>
                  <el-input size="small" v-model="searchKeys[search.id].value"></el-input>
                </div>
              </el-form-item>
              <br>
              <el-form-item>
                <el-button size="small" type="primary" @click="onSearchDevices()">搜索</el-button>
                <!-- <el-button size="small" @click="resetForm('searchKeys')">清空</el-button> -->
              </el-form-item>
            </el-form>
            <el-table
              :data="deviceTable"
              border
              v-loading.body="deviceLoading"
              @selection-change="handleSelectionChange"
              style="width: 100%; min-width: 460px">
              <el-table-column
                type="selection"
                width="65">
              </el-table-column>
              <el-table-column
                v-for="item in searchKeyList"
                :prop="item.id"
                :label="item.name"></el-table-column>
            </el-table>
            <div class="btn-area">
              <el-button class="md" type="info" size="small" @click="onAddtoOff">添加至设备列表</el-button>
            </div>
            <h5>设备列表</h5>
            <el-table
              :data="hostList"
              border
              style="width: 100%; min-width: 460px">
              <el-table-column
                inline-template
                :context="_self"
                label="操作"
                width="65">
                <span>
                  <el-button size="mini" type="warning" @click="onRemove(row)">移除</el-button>
                </span>
              </el-table-column>

              <el-table-column
                v-for="item in searchKeyList"
                :prop="item.id"
                :label="item.name">
              </el-table-column>

            </el-table>
          </div>
        </el-card>
        <div class="btn-area">
          <el-button :disabled="hostList.length === 0" type="primary" @click="onSubmit">确认</el-button>
          <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import headerFormStructureDisplay from '../../_plugins/_headerFormStructureDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  import searchBar from '../../_plugins/_searchBar'

  export default {
    data () {
      return {
        assignForm: {
          header: {},
          body: []
        },
        routerInfo: {},
        deviceType: '',
        hostList: [],
        mainInfo: {},
        searchKeys: {},
        searchKeyList: [],
        deviceTable: [],
        deviceLoading: false,
        deviceTotal: 0,
        searchData: {},
        oplist: [
          {id: 'eq', name: '等于'},
          {id: 'neq', name: '不等于'},
          {id: 'reg', name: '包含'}
        ]
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      if (this.routerInfo.device === 'HOSTINFO') {
        this.deviceType = 'equipment_on'
      } else if (this.routerInfo.device === 'STORAGE') {
        this.deviceType = 'equipment_on_storage'
      } else {
        this.deviceType = 'equipment_on_netd'
      }
      this.renderForm()
      // this.renderTaskForm()
    },
    watch: {
      '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象
        this.routerInfo = this.$route.params
        console.log(this.routerInfo.device)
        if (this.routerInfo.device === 'HOSTINFO') {
          this.deviceType = 'equipment_on'
        } else if (this.routerInfo.device === 'STORAGE') {
          this.deviceType = 'equipment_on_storage'
        } else {
          this.deviceType = 'equipment_on_netd'
        }
        this.renderForm()
      }
    },
    methods: {
      renderForm () {
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.deviceType, // equipment_on_storage equipment_on_netd
            tkey: 'start'
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          const attrList = res.data.data.form.header
          console.log(attrList)
          for (const block of attrList) {
            for (const item of block.value) {
              this.mainInfo = item
              this.assignForm.header[item.id] = []
              if (item.value.type === 'search_bar') {
                // 过滤掉 非搜索 字段
                this.searchKeyList = item.value.source.data.params.filter(item => {
                  return item.value.type === 'input'
                })
                // 取搜索字段的必读字段(非输入的搜索字段)
                for (const param of item.value.source.data.params) {
                  if (param.value.type === 'static') {
                    this.searchData[param.id] = param.value.value
                  }
                }
                // 绑定搜索字段，响应式取值
                for (const key of this.searchKeyList) {
                  this.$set(this.searchKeys, key.id, {})
                  this.$set(this.searchKeys[key.id], 'value', '')
                  this.$set(this.searchKeys[key.id], 'op', 'reg')
                }
              }
            }
          }
        })
      },
      onSearchDevices () {
        let searchData = Object.assign(this.searchData, this.filterObj(this.searchKeys))
        console.log(searchData)
        if (this.isEmptyObj(searchData)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        // searchData.isapply = 'no' // 未被占用
        let postData = {
          action: this.mainInfo.value.source.data.action,
          method: this.mainInfo.value.source.data.method,
          data: searchData
        }
        this.deviceLoading = false
        this.http.post(this.mainInfo.value.source.url.substring(4), this.parseData(postData)).then((res) => {
          console.log(res)
          if (!res.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          console.log(res)
          this.deviceTotal = res.data.data.total
          this.deviceTable = this.getPathResult(res, this.mainInfo.value.source.res.data_path)
          this.deviceLoading = false
        })
      },
      onAddtoOff () {
        for (const selection of this.selectedDevices) {
          console.log(this.hostList)
          if (!this.hostList.includes(selection)) {
            if (this.selectedDevices.length > this.limit) {
              this.$message.warning(`设备选择最多${this.limit}个！`)
            } else {
              this.hostList = [...this.hostList, selection]
            }
          } else {
            this.$message.warning(`下架列表中已存在${selection.name}`)
          }
        }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
      },
      onRemove (row) {
        const index = this.hostList.indexOf(row)
        this.hostList.splice(index, 1)
      },
      resetForm (formName) {
        console.log(this.$refs)
        this.$refs[formName].resetFields()
      },
      onSubmit () {
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.show.type) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if (this.getPathResult(this.assignForm.header, item.show.key_path) === item.show.value) {
                  this.assignForm.header[item.id] = this.hostList
                }
              }
            }
          })
        })
        console.log(this.assignForm)
        // const postData = {
        //   action: 'runtime/process/instances',
        //   method: 'POST',
        //   data: {
        //     pkey: this.deviceType,
        //     form: {
        //       'body': [],
        //       'header': this.assignForm.header
        //     }
        //   }
        // }
        // this.http.post('', this.parseData(postData))
        //   .then((res) => {
        //     if (res && res.status === 200) {
        //       this.$message({
        //         type: 'success',
        //         message: '提交成功!'
        //       })
        //       this.$router.replace('/orders') // 设备成功上架后跳到工单管理
        //     }
        //   })
      },
      onReject (task, action) {
        console.log(task, action.pass)
        this.$prompt('请输入对「' + task.applicationName + '」的' + action.name + '意见：', '确定' + action.name + '？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          if (!value) {
            this.$message.error('失败：驳回意见不可留空！')
            return
          }
          let postData = {
            action: 'runtime/task/complete',
            method: 'POST',
            data: {
              tid: this.routerInfo.id,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已驳回！')
            }
            this.$router.go(-1) // 跳转历史的上一页
          })
        })
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      }
    },
    components: {
      // searchFormStructure,
      headerFormStructureDisplay,
      formStructureDisplay,
      formStructure,
      headerFormStructure,
      searchBar
    }
  }
</script>
