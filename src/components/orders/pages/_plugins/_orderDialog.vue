<template>
  <el-dialog
    :title="orderViewData.order.pinstance.pd.pname"
    v-model="orderViewData.visible">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form">
          <el-form-item v-if="orderViewData.order.pinstance.pd.pname" label="任务名称：">
            <span>{{orderViewData.order.pinstance.pd.pname}}</span>
          </el-form-item>
          <el-form-item v-if="orderViewData.order.pinstance.pnum" label="流程单号：">
            <span>{{orderViewData.order.pinstance.pnum}}</span>
          </el-form-item>
        </el-form>
        <progress-wrap :progress="{
         task: orderViewData.order.ptask.tkey,
         pkey: orderViewData.order.pinstance.pkey,
         taskList: orderViewData.order.pinstance.task_list
         }"></progress-wrap>
        <!-- <h5 class="sub-title" v-if="orderViewData.order.variables && orderViewData.order.variables.message"><i class="el-icon-information"></i> 完整历史步骤（{{ orderViewData.order.variables.message.length }}）</h5>
        <el-collapse v-if="orderViewData.order.history_list" class="history-list">
          <el-collapse-item v-for="(task, key) in orderViewData.order.history_list" :title="(key + 1).toString() + '. ' + task.task_name">
            <el-form label-position="left" label-width="90px" inline class="expanded-form">
              <el-form-item v-if="task.task_key" label="任务 Key：">
                <code>{{task.task_key}}</code>
              </el-form-item>
              <el-form-item v-if="task.operator" label="操作者：">
                <span>{{task.operator.name}}</span>
              </el-form-item>
              <el-form-item v-if="task.time" label="时间：">
                <span>{{task.time}}</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse> -->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import progressWrap from '../../../_plugins/_progress'

  export default {
    props: {
      orderViewData: Object
    },

    components: {
      progressWrap
    }
  }
</script>