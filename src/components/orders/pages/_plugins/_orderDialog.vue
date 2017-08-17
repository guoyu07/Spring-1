<template>
  <el-dialog
    :title="orderViewData.order.pinstance.pd.pname"
    v-model="orderViewData.visible"
    size="large">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" label-width="100px">
          <el-form-item v-if="orderViewData.order.pinstance.pd.pname" label="任务名称：">
            <span>{{orderViewData.order.pinstance.pd.pname}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.pinstance.pnum" label="流程单号：">
            <span>{{orderViewData.order.pinstance.pnum}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.pinstance.author" label="发起者：">
            <span>{{orderViewData.order.pinstance.author.nick}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.assign" label="处理人：">
            <span>{{orderViewData.order.assign.nick}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.assign_group" label="处理组：">
            <span>{{orderViewData.order.assign_group.name}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.candidate_users.length" label="候选人：">
            <el-tag v-for="user in orderViewData.order.candidate_users" type="gray">{{user.nick}}</el-tag>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.candidate_groups.length" label="候选人：">
            <el-tag v-for="group in orderViewData.order.candidate_groups" type="gray">{{group.name}}</el-tag>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.ctime" label="创建时间：">
            <span>{{orderViewData.order.ctime}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.assign_time" label="认领时间：">
            <span>{{orderViewData.order.assign_time}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.etime" label="结束时间：">
            <span>{{orderViewData.order.etime}}</span>
          </el-form-item>
        </el-form>
        <progress-wrap :progress="{
         task: orderViewData.order.ptask.tkey,
         pkey: orderViewData.order.pinstance.pkey,
         taskList: orderViewData.order.pinstance.task_list
         }"></progress-wrap>
        <h5 class="sub-title" v-if="orderViewData.order.pinstance.history_list"><i class="el-icon-information"></i> 完整历史步骤（{{ orderViewData.order.pinstance.history_list.length }}）</h5>
        <el-collapse v-if="orderViewData.order.pinstance.history_list" class="history-list">
          <el-collapse-item v-for="(task, key) in orderViewData.order.pinstance.history_list" :title="(key + 1).toString() + '. ' + task.name">
            <el-form label-position="left" label-width="90px" inline class="expanded-form">
              <el-form-item v-if="task.task_key" label="任务 Key：">
                <code>{{task.task_key}}</code>
              </el-form-item>
              <el-form-item v-if="task.operator" label="操作者：">
                <span>{{task.operator.nick}}</span>
              </el-form-item>
              <el-form-item v-if="task.time" label="时间：">
                <span>{{task.time}}</span>
              </el-form-item>
              <el-form-item v-if="task.workFlowNo" label="工单号：">
                <span>{{task.workFlowNo}}</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <span class="dialog-footer" slot="footer">
      <el-button
        v-if="filterName === '待认领'"
        type="info"
        @click="onClaim()" icon="check">认领</el-button>
      <router-link
        v-else-if="['host'].includes(orderViewData.order.pinstance.pkey) && filterName === '待处理'" 
        :to="{ path: `/guosen/${orderViewData.order.pinstance.pkey}/${orderViewData.order.ptask.tkey}/${orderViewData.order.tid}/${orderViewData.order.ptask.tname}`}" >
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <router-link
        v-else-if="['host'].includes(orderViewData.order.pinstance.pkey) && filterName === '已参与'" 
        :to="{ path: `/guosen-info/${orderViewData.order.pinstance.pkey}/${orderViewData.order.ptask.tkey}/${orderViewData.order.pinstance.pid}/${orderViewData.order.ptask.tname}`} ">
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <router-link
        v-else-if="['host'].includes(orderViewData.order.pinstance.pkey) && filterName === '历史参与'" 
        :to="{ path: `/guosen-info/${orderViewData.order.pinstance.pkey}/${orderViewData.order.pinstance.pid}`} ">
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <template v-else>
        <router-link
          v-if="filter === '待处理'"
          :to="{ path: `/procedure/${orderViewData.order.pinstance.pkey}/${orderViewData.order.ptask.tkey}/${orderViewData.order.tid}/${orderViewData.order.ptask.tname}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
        <router-link
          v-if="filter === '已参与'"
          :to="{ path: `/procedure-info/${orderViewData.order.pinstance.pkey}/${orderViewData.order.ptask.tkey}/${orderViewData.order.pinstance.pid}/${orderViewData.order.ptask.tname}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
        <router-link
          v-if="filter === '历史参与'"
          :to="{ path: `/procedure-info/${orderViewData.order.pinstance.pkey}/${orderViewData.order.pinstance.pid}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
      </template>
    </span>
  </el-dialog>
</template>

<script>
  import progressWrap from '../../../_plugins/_progress'

  export default {
    props: {
      orderViewData: Object,
      filterName: String
    },

    components: {
      progressWrap
    }
  }
</script>