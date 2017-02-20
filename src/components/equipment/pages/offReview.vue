<template>
  <div class="off-review">
    <el-row>
      <el-col :lg="24">
        <el-card class="box-card">
          <h3>审核流程</h3>
          <el-table
            :data="deviceTable"
            border
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
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <span>
                <el-button type="text" @click="onReview(row)">审核</el-button>
              </span>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        multipleSelection: [],
        deviceTable: [{
          id: 1,
          name: '设备一',
          number: '1234567890',
          other: 'xxxx',
          os: 'Windows',
          db: 'mongodb',
          agent: true,
          ip: '1.1.1.1',
          port: '80',
          ubit: '3',
          cabinet: '4',
          room: '5',
          app: 'xxx'
        }, {
          id: 2,
          name: '设备二',
          number: '1234567890',
          os: 'Windows',
          db: 'mongodb',
          agent: true,
          other: 'xxxx',
          ip: '1.1.1.1',
          port: '80',
          ubit: '3',
          cabinet: '4',
          room: '5',
          app: 'xxx'
        }]
      }
    },

    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },

      onReview (device) {
        console.log(device)
      }
    }
  }
</script>