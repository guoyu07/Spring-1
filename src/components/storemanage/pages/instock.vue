<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" class="step-card">
        <el-card class="box-card step-card">
          <h3>入库流程</h3>
          <el-steps :space="380" :active="activeStep">
            <el-step title="选择设备类型" :description="deviceValue.label"></el-step>
            <el-step title="设备录入"></el-step>
          </el-steps>
          <el-col>
            <div class="step step-1" v-show="activeStep === 1">
              <el-form label-position="left" label-width="100px">
                <el-form-item label="设备类型">
                  <el-select v-model="deviceValue">
                    <el-option v-for="device in deviceList"
                      :label="device.label"
                      :value="device"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="btn-area">
                <el-button type="primary" class="md" @click="activeStep++" :disabled="!deviceValue.value">下一步</el-button>
              </div>
            </div>
            <div class="step step-2" v-show="activeStep === 2">
              <div class="btn-area">
                <el-button @click="activeStep--" class="md">上一步</el-button>
              </div>
              <el-form label-position="top" :inline="true" ref="instockForm" :model="instockForm">
                <el-button size="small" @click="onAdd" class="margin-bottom" icon="plus">增加{{ deviceValue.label }}</el-button>
                <el-tabs type="card" closable @tab-click="handleClick" @tab-remove="handleRemove">
                  <el-tab-pane  v-for="(item, index) in instockForm.data" :key="item.id" :label="'设备' + (index + 1)">
                    <h4 class="form-title">管理信息</h4>
                    <el-form-item
                      label="IT资产编号"
                      :prop="'data.' + index + '.ItNo'"
                      :rules="{
                        required: true, message: 'IT资产编号不能为空', trigger: 'blur'
                      }">
                      <el-input v-model="item.ItNo"></el-input>
                    </el-form-item>

                    <el-form-item label="公司资产编号">
                      <el-input v-model="item.assertNo"></el-input>
                    </el-form-item>

                    <el-form-item label="所属服务">
                      <el-select v-model="item.subServer">
                        <el-option v-for="server in serverList"
                          :label="server.label"
                          :value="server"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="管理部门">
                      <el-select v-model="item.department">
                        <el-option v-for="department in departmentList"
                          :label="department.label"
                          :value="department"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="管理人">
                      <el-input v-model="item.management"></el-input>
                    </el-form-item>

                    <el-form-item label="所属应用服务">
                      <el-input v-model="item.subApplication" placeholder="所属业务/应用/项目组"></el-input>
                    </el-form-item>

                    <el-form-item label="重要度">
                      <el-input type="number" v-model="item.importantDegree"></el-input>
                    </el-form-item>

                    <el-form-item label="重要等级">
                      <el-input-number v-model="item.importantLevel" :min="1" :max="10"></el-input-number>
                    </el-form-item>

                    <h4 class="form-title">设备信息</h4>
                    <el-form-item label="制造商">
                      <el-select v-model="item.manufacturer">
                        <el-option v-for="factory in factoryList"
                          :label="factory.label"
                          :value="factory"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="设备型号">
                      <el-input v-model="item.deviceModel"></el-input>
                    </el-form-item>

                    <el-form-item label="SN序列号">
                      <el-input v-model="item.SNSerialNumber"></el-input>
                    </el-form-item>

                    <el-form-item label="CPU性能">
                      <el-input v-model="item.CPUPerformance"></el-input>
                    </el-form-item>

                    <el-form-item label="内存性能">
                      <el-input v-model="item.memoryPerformance"></el-input>
                    </el-form-item>

                    <el-form-item label="硬盘情况">
                      <el-input v-model="item.hardDisk"></el-input>
                    </el-form-item>

                    <el-form-item label="RAID方式">
                      <el-select v-model="item.RAIDMode">
                        <el-option v-for="raid in raidList"
                          :label="raid.label"
                          :value="raid"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="U数">
                      <el-input-number v-model="item.uNumber" :min="1"></el-input-number>
                    </el-form-item>

                    <el-form-item
                      label="IP"
                      :prop="'data.' + index + '.internetProtocol'"
                      :rules="[
                        {validator: validateIP, trigger: 'blur'}
                      ]">
                      <el-input v-model="item.internetProtocol"></el-input>
                    </el-form-item>


                    <el-form-item label="OS操作系统">
                      <el-input v-model="item.opertatingSystem"></el-input>
                    </el-form-item>

                    <h4 class="form-title">维保相关</h4>
                    <el-form-item prop="date" label="出厂日期">
                      <el-date-picker type="date" placeholder="选择日期" v-model="item.manufactureDate"></el-date-picker>
                    </el-form-item>

                    <el-form-item prop="date" label="维保到期日">
                      <el-date-picker type="date" placeholder="选择日期" v-model="item.maintenanceDate"></el-date-picker>
                    </el-form-item>

                    <el-form-item prop="date" label="建议续约日期">
                      <el-date-picker type="date" placeholder="选择日期" v-model="item.proposedRenewalDate"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="续约状态">
                      <el-select v-model="item.renewState">
                        <el-option v-for="state in renewStateList"
                          :label="state.label"
                          :value="state"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="续约方式">
                      <el-select v-model="item.renewStyle">
                        <el-option v-for="style in renewStyleList"
                          :label="style.label"
                          :value="style"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="续约责任人">
                      <el-input v-model="item.renewHead"></el-input>
                    </el-form-item>

                    <el-form-item label="维保服务商">
                      <el-input v-model="item.maintenanceProvider"></el-input>
                    </el-form-item>

                    <el-form-item label="维保联系人">
                      <el-input v-model="item.maintenanceContact"></el-input>
                    </el-form-item>

                    <el-form-item label="维保责任部门">
                      <el-select v-model="item.maintenanceDepartment">
                        <el-option v-for="maintenance in maintenanceDepartmentList"
                          :label="maintenance.label"
                          :value="maintenance"></el-option>
                      </el-select>
                    </el-form-item>

                     <el-form-item label="订单号">
                      <el-input v-model="item.orderNumber"></el-input>
                    </el-form-item>

                    <h4 class="form-title">默认状态</h4>
                    <el-form-item label="所在地点">
                      <el-select v-model="item.place">
                        <el-option v-for="place in placeList"
                          :label="place.label"
                          :value="place"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="当前状态">
                      <el-select v-model="item.currentState">
                        <el-option v-for="currentState in currentStateList"
                          :label="currentState.label"
                          :value="currentState"></el-option>
                      </el-select>
                    </el-form-item>

                  </el-tab-pane>
                </el-tabs>
              </el-form>
              <el-button type="primary" class="margin-top" @click="onConfirm">确认</el-button>
            </div>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      // var validateIP = (rule, value, cb) => {
      //   const reg = /^(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])$/
      //   if (!value.match(reg)) {
      //     cb(new Error('请输入正确的IP地址'))
      //   }
      // }
      return {
        activeStep: 1,
        deviceValue: {},
        instockForm: {
          remark: '',
          data: [{
            id: 0,
            ItNo: '',
            assertNo: '',
            department: {},
            management: '',
            subApplication: '',
            subServer: {},
            importantDegree: 1,
            importantLevel: 1,
            manufacturer: {},
            deviceModel: '',
            SNSerialNumber: '',
            CPUPerformance: '',
            memoryPerformance: '',
            hardDisk: '',
            RAIDMode: {},
            uNumber: 1,
            internetProtocol: '',
            opertatingSystem: '',
            manufactureDate: '',
            maintenanceDate: '',
            proposedRenewalDate: '',
            renewState: {},
            renewStyle: {},
            renewHead: '',
            maintenanceProvider: '',
            maintenanceContact: '',
            maintenanceDepartment: {},
            orderNumber: '',
            place: '仓库',
            currentState: '空闲'
          }]
        },
        currentStateList: [{ // 当前状态
          label: '空闲',
          value: 'idle'
        }, {
          label: '使用中',
          value: 'using'
        }, {
          label: '故障中',
          value: 'malfunction'
        }, {
          label: '隔离中',
          value: 'isolation'
        }, {
          label: '待报废',
          value: 'tobescrapped'
        }],
        placeList: [{ // 所在地点
          label: '仓库',
          value: 'warehouse'
        }, {
          label: '机房',
          value: 'engineroom'
        }, {
          label: '其他',
          value: 'others'
        }],
        maintenanceDepartmentList: [{ // 维保责任部门
          label: '采购部',
          value: 'purchase'
        }, {
          label: '其他',
          value: 'others'
        }],
        renewStateList: [{ // 续约状态
          label: '准备启动',
          value: 'ready'
        }, {
          label: '终止',
          value: 'over'
        }, {
          label: '其他',
          value: 'others'
        }],
        renewStyleList: [{ // 续约方式
          label: '硬件维保',
          value: 'hardware'
        }, {
          label: '服务维保',
          value: 'server'
        }],
        raidList: [{ // RAID方式
          label: '0',
          value: '0'
        }, {
          label: '1',
          value: '1'
        }, {
          label: '5',
          value: '5'
        }, {
          label: '10',
          value: '10'
        }, {
          label: '01',
          value: '01'
        }, {
          label: '2',
          value: '2'
        }, {
          label: '3',
          value: '3'
        }, {
          label: '4',
          value: '4'
        }, {
          label: '6',
          value: '6'
        }, {
          label: '7',
          value: '7'
        }, {
          label: '5E',
          value: '5E'
        }, {
          label: '5EE',
          value: '5EE'
        }, {
          label: '50',
          value: '50'
        }, {
          label: '其他',
          value: 'others'
        }],
        factoryList: [{ // 制造商
          label: 'Lenovo',
          value: 'Lenovo'
        }, {
          label: 'DELL',
          value: 'DELL'
        }, {
          label: 'Inspur',
          value: 'Inspur'
        }, {
          label: 'HP',
          value: 'HP'
        }, {
          label: 'IBM',
          value: 'IBM'
        }, {
          label: 'SUN',
          value: 'SUN'
        }, {
          label: 'Oracle',
          value: 'Oracle'
        }, {
          label: '齐治科技',
          value: 'QIZHI'
        }, {
          label: 'GreatWall',
          value: 'GreatWall'
        }],
        departmentList: [{  // 管理部门
          label: '春秋航空IT部',
          value: 'springAirlines'
        }, {
          label: '春秋国旅IT部',
          value: 'springTravel'
        }, {
          label: '中国移动',
          value: 'cmcc'
        }, {
          label: '佳讯',
          value: 'abc'
        }, {
          label: '强冠',
          value: 'foodanddrink'
        }, {
          label: '其他',
          value: 'others'
        }],
        serverList: [{  // 所属服务
          label: '测试系统',
          value: 'test'
        }, {
          label: '业务系统',
          value: 'business'
        }, {
          label: '办公系统',
          value: 'office'
        }, {
          label: '离港系统',
          value: 'departure'
        }, {
          label: '空闲',
          value: 'free'
        }],
        deviceList: [{ // 设备类型
          label: '服务器',
          value: 'server'
        }, {
          label: '网络设备',
          value: 'network'
        }, {
          label: '存储设备',
          value: 'storage'
        }, {
          label: '其他外设',
          value: 'others'
        }],
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

        // rules2: {
        //   internetProtocol: [
        //     {validator: validateIP, trigger: 'blur'}
        //   ]
        // }
      }
    },

    methods: {
      handleRemove (tab) {
        this.instockForm.data.splice(tab.index, 1)
        // console.log(tab.index, this.instockForm.data)
      },
      handleClick (tab, event) {
        // console.log(tab.index, tab, event)
      },
      onAdd () {
        var that = this
        if (that.instockForm.data.length < 10) {
          that.instockForm.data.push({
            id: 0,
            ItNo: '',
            assertNo: '',
            department: {},
            management: '',
            subApplication: '',
            subServer: {},
            importantDegree: 1,
            importantLevel: 1,
            manufacturer: {},
            deviceModel: '',
            SNSerialNumber: '',
            CPUPerformance: '',
            memoryPerformance: '',
            hardDisk: '',
            RAIDMode: {},
            uNumber: 1,
            internetProtocol: '',
            opertatingSystem: '',
            manufactureDate: '',
            maintenanceDate: '',
            proposedRenewalDate: '',
            renewState: {},
            renewStyle: {},
            renewHead: '',
            maintenanceProvider: '',
            maintenanceContact: '',
            maintenanceDepartment: {},
            orderNumber: '',
            place: '仓库',
            currentState: '空闲'
          })
        } else {
          that.$message.warning('最多只能增加 10 个设备！')
        }
      },
      onConfirm () {
        console.log(this.instockForm)
      }
    },

    components: {
      // deviceView
    }
  }
</script>

<style lang="less">
  .step-card {

    .el-select {
      width: 100%;
    }

    .step {
      margin: 24px 0;
    }

    .step-1 {
      width: 400px;
      margin: 0 auto;
    }

    .el-steps {
      width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-area {
      margin-bottom: 24px;
      text-align: center;
    }
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
