<template>
  <el-dialog
    :title="claimViewData.task.name"
    v-model="claimViewData.visible">
    <el-row v-if="claimViewData.task !== {}">
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" v-if="claimViewData.task.variables">
          <el-form-item label="告警对象：">
            <span>{{claimViewData.task.variables.message[0].form.header.alter_obj}}</span>
          </el-form-item>
          <el-form-item label="告警等级：">
            <span>{{claimViewData.task.variables.message[0].form.header.alter_level}}</span>
          </el-form-item>
          <el-form-item label="影响范围：">
            <span>{{claimViewData.task.variables.message[0].form.header.alter_range}}</span>
          </el-form-item>
          <el-form-item label="通知人：">
            <span>{{claimViewData.task.variables.message[0].form.header.receiver_userId}}</span>
          </el-form-item>
          <el-form-item label="告警状态：">
            <span>{{claimViewData.task.variables.message[0].form.header.alter_status}}</span>
          </el-form-item>
          <el-form-item label="告警时间：">
            <span>{{claimViewData.task.variables.message[0].form.header.alter_ctime}}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="dialog-footer" slot="footer">
      <el-button type="info" @click="onClaim(claimViewData.task.id)" icon="check">认领</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      claimViewData: { type: Object }
    },

    methods: {
      onClaim (id) {
        let postData = {
          action: 'runtime/task/claim',
          method: 'POST',
          data: { tid: id }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已认领！')
            this.claimViewData.visible = false
            // this.getTaskList()
            this.$router.replace(`/storemanage/${this.claimViewData.task.pkey}/${this.claimViewData.task.taskDefinitionKey}/${this.claimViewData.task.id}/${this.claimViewData.task.name}`)
          }
        })
      }
    }
  }
</script>
