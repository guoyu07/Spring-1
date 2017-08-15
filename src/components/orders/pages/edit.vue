<template>
  <div>
    <el-card>
      <h3><i class="el-icon-fa-filter icon-lg"></i> {{ $route.meta.isEdit ? `编辑${filterData.name}` : '创建' }}筛选器</h3>
      <el-form class="order-form" label-width="100px">
        <el-form-item label="筛选器名称">
          <el-input class="shorter-input" v-model="filterData.name"></el-input>
        </el-form-item>
        <el-form-item label="筛选条件">
          <condition-conf :filters="filterData.filters" @on-filter-change="onFilterMutated"></condition-conf>
        </el-form-item>
        <el-form-item label="排序规则">
          <order-conf :order="filterData.order" @on-order-change="onFilterMutated"></order-conf>
        </el-form-item>
        <el-form-item label="显示列">
          <column-conf :columns="filterData.show" @on-column-change="onColumnMutated"></column-conf>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="check" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      :data="filteredTasks.list"
      v-loading="loading"
      max-height="250"
      border
      style="margin-top: 12px; opacity: .4;">
      <el-table-column
        v-for="col in filterData.show"
        :prop="col.key_path"
        :label="col.label"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import conditionConf from './_plugins/_conditionConf'
  import orderConf from './_plugins/_orderConf'
  import columnConf from './_plugins/_columnConf'

  import getFilteredTasks from './../../../mixins/getFilteredTasks'

  import EventHub from './../../../utils/event-hub'

  export default {
    mixins: [ getFilteredTasks ],

    computed: {
      isEdit () {
        return this.$route.meta.isEdit
      }
    },

    created () {
      if (this.isEdit) {
        this.getFilterData(this.orderId)
      } else {
        this.filterData = {
          name: '新过滤器',
          order: 'pinstance__pnum',
          show: [],
          filters: []
        }
      }
    },

    methods: {
      onFilterMutated (args) {
        // if (!args.filters) return
        Object.assign(this.filterData, args)
        this.getFilteredTasks()
      },

      onColumnMutated (args) {
        Object.assign(this.filterData, args)
      },

      onSubmit () {
        let postData = {
          action: 'filter',
          method: this.isEdit ? 'PUT' : 'POST',
          data: this.filterData
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success(this.isEdit ? '已更新！' : '已创建！')
            this.$router.push({ path: `/orders/queues/${res.data.data.id}` })
            EventHub.$emit('should-refetch-filters')
          }
        })
      }
    },

    components: {
      conditionConf,
      orderConf,
      columnConf
    }
  }
</script>

<style lang="less">
  .shorter-input {
    max-width: 200px;
  }

  .flex-checkboxes {
    display: flex;
    flex-wrap: wrap;
    max-height: 280px;
    overflow-y: scroll;

    .el-checkbox {
      margin-left: 0;
      padding: 8px 0 0 8px;
      flex: 1;
    }
  }
</style>