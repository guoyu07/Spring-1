<template>
  <el-dialog
    :title="assignViewData.task.name"
    v-model="assignViewData.visible">
    <el-row v-if="assignViewData.task !== {}">
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" v-if="assignViewData.task.variables">
          <!-- <el-form-item label="流程名称">
            <span>{{assignViewData.pname}}</span>
          </el-form-item>
          <el-form-item label="任务名称">
            <span>{{assignViewData.name}}</span>
          </el-form-item>
          <el-form-item label="任务 ID">
            <span>{{assignViewData.id}}</span>
          </el-form-item>
          <el-form-item label="现被指派者">
            <span>{{assignViewData.assignee}}</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <small>{{assignViewData.createTime}}</small>
          </el-form-item> -->
          <el-form-item label="告警对象：">
            <span>{{assignViewData.task.variables.message[0].form.header.alter_obj}}</span>
          </el-form-item>
          <el-form-item label="告警等级：">
            <span>{{assignViewData.task.variables.message[0].form.header.alter_level}}</span>
          </el-form-item>
          <el-form-item label="影响范围：">
            <span>{{assignViewData.task.variables.message[0].form.header.alter_range}}</span>
          </el-form-item>
          <el-form-item label="通知人：">
            <span>{{assignViewData.task.variables.message[0].form.header.receiver_userId}}</span>
          </el-form-item>
          <el-form-item label="告警状态：">
            <span>{{assignViewData.task.variables.message[0].form.header.alter_status}}</span>
          </el-form-item>
          <el-form-item label="告警时间：">
            <span>{{assignViewData.task.variables.message[0].form.header.alter_ctime}}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row v-if="assignViewData.task !== {}">
      <el-col :span="20" :offset="2">
        <h5 class="sub-title"><i class="el-icon-circle-check"></i> 请勾选欲指派的用户或候选组：</h5>
        <el-form label-width="60px" label-position="left">
          <el-form-item label="用户">
            <el-radio-group v-model="newAssignee">
              <el-radio v-for="user in userList" :label="user.userId" :disabled="assignViewData.task.assignee === user.userId">{{user.code}}</el-radio>
            </el-radio-group>
            <el-button v-if="newAssignee" type="warning" :plain="true" size="mini" @click="newAssignee=''">重置用户</el-button>
          </el-form-item>
          <el-form-item label="候选组">
            <el-checkbox-group v-model="newAssigneeGroup" v-if="assignViewData.task.candidate_groups">
              <el-checkbox v-for="role in roleList" :label="role.key" :checked="assignViewData.task.candidate_groups.includes(role.key)">{{role.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="dialog-footer" slot="footer">
      <el-button type="success" @click="onAssign(assignViewData.task.id, newAssignee, newAssigneeGroup)" icon="check" :disabled="!newAssignee && !newAssigneeGroup.length">确认指派</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import onAssign from './../../../mixins/onAssign'
  export default {
    mixins: [onAssign],
    props: {
      assignViewData: { type: Object },
      roleList: { type: Array },
      userList: { type: Array }
    }
  }
</script>