<template>
  <div id="item1-side" class="wrapper">
    <h3>资源申请列表</h3>
    <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link>
    <el-table
      :data="applylist"
      border
      style="width: 100%; min-width: 460px">
      <el-table-column type="expand">
        <template scope="props">
          <div class="item-block" v-for="item in props.row.data">
            <p>主机: {{ item.hostType }}</p>
            <p>环境: {{ item.environment }}</p>
            <p>数量: {{ item.quantity }}</p>
            <p>OS: {{ item.operateSystem }}</p>
            <p>CPU: {{ item.cpu }}</p>
            <p>内存(G): {{ item.internalStorage }}</p>
            <p>硬盘(G): {{ item.hardDisk }}</p>
            <p>资源分数: {{ item.score }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="applicationName"
        label="应用名"></el-table-column>
      <el-table-column
        prop="applyType"
        label="申请类型"></el-table-column>
      <el-table-column
        prop="business"
        label="项目组"></el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作">
        <div class="btn-block">
          <el-button type="text" @click="onAssign(row)">资源分配</el-button>
          <el-button type="text" @click="showDialogReject(row)">驳回</el-button>

          <el-dialog title="提示" v-model="dialogReject" size="tiny">
            <span>驳回后不可恢复，确定要驳回此申请吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="onCancel">取 消</el-button>
              <el-button type="primary" @click="onReject(row)">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dialogReject: false,
        applylist: []
      }
    },
    created () {
      console.log('created')
      this.onloadlist()
    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      onloadlist () {
        const postData = {
          action: 'runtime/tasks/self',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          const all = res.data.data.data
          all.forEach((list, k) => {
            list.variables.message.map(item => {
              if (item.task_key === 'start') {
                this.applylist[k] = item.form
              }
            })
          })
        })
      },
      onAssign (row) {
        this.$router.replace('/system/assign')
      },
      showDialogReject (row) {
        this.dialogReject = true
      },
      onReject (row) {
        console.log(row)
        this.dialogReject = false
      },
      onCancel () {
        this.dialogReject = false
      },
      removeItem (item) {
        var index = this.applyForm.data.indexOf(item)
        if (index !== -1) {
          this.applyForm.data.splice(index, 1)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.btn-block {
  .el-button {
    margin-right: 10px;
    margin-left: 0;

    &:last-child {
      margin-right: 0;
    }
  }
}
.item-block {
  display: inline-block;
  margin-right: 30px;
  padding-right: 20px;
  border-right: 1px dashed #e0e6ed;
  color: #5e6d82;

  &:last-child {
    border-right: none;
  }
}
.margin-bottom {
  margin-bottom: 15px;
}
</style>
