<template>
  <div class="confirm">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card step-card">
          <h3><i class="el-icon-fa-gavel"></i> 审核流程</h3>
          <el-row>
            <el-col :md="24" :lg="{ span: 20, offset: 2}">
              <div class="step">
                <el-table
                  :data="selectedDevices"
                  @selection-change="onSelectRow"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55"></el-table-column>
                  <el-table-column
                    type="expand">
                    <template scope="props">
                      <table class="device-data-table">
                        <tbody>
                          <tr>
                            <td><b>是否安装代理</b></td>
                            <td>{{ props.row.agent ? '是' : '否' }}</td>
                            <td><b>操作系统</b></td>
                            <td>{{ props.row.os }}</td>
                          </tr>
                          <tr>
                            <td><b>应用服务</b></td>
                            <td>{{ props.row.app }}</td>
                            <td><b>数据库</b></td>
                            <td>{{ props.row.db }}</td>
                          </tr>
                          <tr>
                            <td><b>机房</b></td>
                            <td>{{ props.row.room }}</td>
                            <td><b>机柜</b></td>
                            <td>{{ props.row.cabinet }}</td>
                          </tr>
                          <tr>
                            <td><b>U 位</b></td>
                            <td>{{ props.row.ubit }}</td>
                            <td><b>IP</b></td>
                            <td>{{ props.row.ip }}</td>
                          </tr>
                          <tr>
                            <td><b>端口</b></td>
                            <td>{{ props.row.port }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
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
                  <el-table-column
                    label="操作"
                    inline-template
                    :context="_self">
                    <template>
                      <el-button size="small" @click="onPrint(row)">打印</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <br>
                <div class="btn-area">
                  <el-button class="md" type="primary" :disabled="!selectedDevices2.length" @click="onSubmit">提交完成工单</el-button>
                </div>
              </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectedDevices: [{
          'id': 1,
          'name': '设备一',
          'number': '1234567890',
          'other': 'xxxx',
          'os': 'Windows',
          'db': 'mongodb',
          'agent': true,
          'ip': '1.1.1.1',
          'port': '80',
          'ubit': '3',
          'cabinet': '4',
          'room': '5',
          'app': 'xxx'
        }, {
          'id': 2,
          'name': '设备二',
          'number': '1234567890',
          'os': 'Windows',
          'db': 'mongodb',
          'agent': true,
          'other': 'xxxx',
          'ip': '1.1.1.1',
          'port': '80',
          'ubit': '3',
          'cabinet': '4',
          'room': '5',
          'app': 'xxx'
        }],
        selectedDevices2: []
      }
    },

    methods: {
      onSelectRow (val) {
        console.log(val)
        this.selectedDevices2 = val
      },

      onPrint (device) {
        console.log(device.name)
      },

      onSubmit () {
        console.log(this.selectedDevices2)
        this.$message.success('成功提交已选工单！')
      }
    }
  }
</script>