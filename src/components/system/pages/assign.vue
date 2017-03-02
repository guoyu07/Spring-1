<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">服务资源分配</h3>
    <el-form ref="assignForm" :model="assignForm" label-width="85px" :inline="true">
      <el-row :gutter="10" class="m-top">
        <el-form-item label="申请类型">
          {{ applyData.applyType }}
        </el-form-item>

        <el-form-item label="项目组">
          {{ applyData.project }}
        </el-form-item>

        <el-form-item label="应用名">
          {{ applyData.applicationName }}
        </el-form-item>

        <el-form-item label="备注">
        </el-form-item>
      </el-row>

      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane  v-for="(item, index) in assignForm.data" :key="item.id" :label="applyData.data[index].environment">
          <!-- <el-table
            :data="assignForm.data"
            border
            style="width: 100%">
            <el-table-column
              prop="environment"
              label="使用环境"
              width="100">
            </el-table-column>
            <el-table-column
              prop="operateSystem"
              label="OS">
            </el-table-column>
            <el-table-column
              prop="hostType"
              label="主机">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="cpu"
              label="CPU核数">
            </el-table-column>
            <el-table-column
              prop="internalStorage"
              label="内存(G)">
            </el-table-column>
            <el-table-column
              prop="hardDisk"
              label="硬盘(G)">
            </el-table-column>
            <el-table-column
              prop="score"
              label="资源分数">
            </el-table-column>
            <el-table-column
              prop="assetNumber"
              label="资产编号">
            </el-table-column>
          </el-table> -->
          <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
            <table>
              <tr>
                <th>使用环境</th>
                <th>OS</th>
                <th>主机</th>
                <th>数量</th>
                <th>CPU核数</th>
                <th>内存(G)</th>
                <th>硬盘(G)</th>
                <th>资源分数</th>
                <th>资产编号</th>
              </tr>
              <tr>
                <td>{{ applyData.data[index].environment }}</td>
                <td>{{ applyData.data[index].operateSystem }}</td>
                <td>{{ applyData.data[index].hostType }}</td>
                <td>{{ applyData.data[index].quantity }}</td>
                <td>{{ applyData.data[index].cpu }}</td>
                <td>{{ applyData.data[index].internalStorage }}</td>
                <td>{{ applyData.data[index].hardDisk }}</td>
                <td>{{ applyData.data[index].score }}</td>
                <td>{{ applyData.data[index].assetNumber }}</td>
              </tr>
            </table>
          </div>
          <div class="form-block" v-if="applyData.data[index].hostType === '虚拟机'">
            <h5>选择虚拟机的IDC信息</h5>
            <el-form-item
              label="IDC"
              :prop="'data.' + index + '.idc'"
              :rules="{
                required: true, message: 'IDC不能为空', trigger: 'change'
              }">
              <el-select v-model="item.idc" placeholder="请选择IDC">
                <el-option v-for="idc in idcAllList.idclist"
                  :label="idc.label"
                  :value="idc.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="IDC集群"
              :prop="'data.' + index + '.idcgroup'"
              :rules="{
                required: true, message: 'IDC集群不能为空', trigger: 'change'
              }">
              <el-select v-model="item.idcgroup" placeholder="请选择IDC集群">
                <el-option v-for="idcgroup in idcAllList.idcGroupList"
                  :label="idcgroup.label"
                  :value="idcgroup.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-block" v-if="applyData.data[index].hostType === '物理机'">
            <h5>请选择要分配的物理机</h5>
            <el-form-item
              label="出库状态"
              :prop="'data.' + index + '.instockState'">
              <el-select v-model="item.instockState" size="small">
                <el-option label="已出库" value="yep"></el-option>
                <el-option label="未出库" value="none"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="搜索条件">
              <el-input v-model="item.searchone" size="small"></el-input>
            </el-form-item>

            <el-form-item
              label="搜索条件">
              <el-input v-model="item.searchone" size="small"></el-input>
            </el-form-item>
            <el-table
              :data="machineTable"
              border
              v-loading.body="tableLoading"
              @selection-change="handleSelectionChange"
              style="width: 100%; min-width: 460px">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="设备"></el-table-column>
              <el-table-column
                prop="number"
                label="编号"></el-table-column>
              <el-table-column
                prop="other"
                label="其他"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('assignForm')">立即分配</el-button>
        <el-button @click="resetForm('assignForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        idcAllList: {
          idcList: [],
          idcGroupList: []
        },
        idc: [],
        idcgroup: [],
        applyData: {
          applyType: '新建应用',
          project: '民生银行某项目',
          applicationName: '民生银行某应用',
          remark: '',
          data: [{
            id: '123',
            environment: '开发测试环境',
            quantity: '3',
            operateSystem: 'Win2008R2SP1',
            hostType: '虚拟机',
            cpu: '4',
            internalStorage: '12',
            hardDisk: '12',
            assetNumber: '091207',
            score: 23
          }, {
            id: '456',
            environment: '生产环境',
            quantity: '3',
            operateSystem: 'Win7',
            hostType: '物理机',
            cpu: '4',
            internalStorage: '12',
            hardDisk: '12',
            assetNumber: '0231997',
            score: 23
          }]
        },
        assignForm: {
          data: [{
            id: '123',
            idc: '',
            idcgroup: ''
          }, {
            id: '456',
            instockState: 'yep',
            searchone: '',
            searchtwo: '',
            machines: []
          }]
        }
      }
    },
    created () {
      this.renderIDCList()
    },
    methods: {
      renderIDCList () {
        this.$http.get('/idclist').then((res) => {
          this.idcAllList = res.body
        })
      },
      handleClick (tab, event) {
        // console.log(tab.index, tab, event)
      },
      onSearchDevices () {
        if (!this.searchKeys.some((key) => key.value)) {
          this.$message.error('搜索条件不能全空！')
          return
        }
        this.deviceLoading = true
        this.$http.get('/equipmentData').then((res) => {
          this.deviceTable = res.body
        })
      },
      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },
      onSubmit (assignForm) {
        this.$refs[assignForm].validate((valid) => {
          if (valid) {
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (assignForm) {
        this.$refs[assignForm].resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
  .form-block {
    h5 {
      margin: 15px 0;
    }
  }
  .el-select {
    width: 100%;
  }
  .wrapper {
    padding: 20px;

    .form-title {
      font-size: 22px;
      font-weight: 400;
      margin-top: 10px;
      margin-bottom: 40px;
      margin-left: 10px;
      color: #4e5b6d;
    }
  }
  .m-top {
    margin-bottom: 30px;
  }
  .el-form--inline .el-form-item {
    min-width: 280px;
  }
  .el-table {
    table {
      width: 100%;
      table-layout: fixed;
      th, td {
        padding: 5px 10px;
        word-wrap: break-word;
      }
    }
  }
</style>
