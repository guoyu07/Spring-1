<style lang="less" scoped>
  .form-display-info {
    margin-bottom: 12px;
  }

  .v-modal {
    z-index: 0 !important;
  }

  .detail-popover {
    font-size: 12px;

    .el-form-item {
      margin-bottom: 4px;
    }
  }

  .el-checkbox {
    margin-right: 12px;
    margin-bottom: 8px;
  }
  .select-pagination {
    margin-top: 5px;
  }
</style>

<template>
  <el-dialog title="预设集" v-model="selectedPreset.confVisible">
    <h4>所选预设集信息</h4>
    <el-form label-position="right" label-width="60px" :inline="true" class="form-display-info">
      <el-form-item label="名称"><span>{{selectedPreset.name}}</span></el-form-item>
      <el-form-item label="ID"><span>{{selectedPreset.objectId}}</span></el-form-item>
      <el-form-item label="类别"><span>{{selectedPreset.category}}</span></el-form-item>
      <el-form-item label="创建者"><span>{{selectedPreset.creator}}</span></el-form-item>
      <el-form-item label="备注"><span>{{selectedPreset.memo}}</span></el-form-item>
    </el-form>
    <h4>请在预设集中选择欲导入的属性</h4>
    <!-- <small>（鼠标悬浮于属性名，可察看属性详情）</small> -->
    <el-checkbox-group
      v-model="checkedAttributes">
      <el-popover
        placement="top"
        trigger="hover"
        v-for="attr in selectedPreset.attrList"
        :title="attr.name">
        <el-form class="detail-popover" label-position="right" label-width="60px">
          <el-form-item label="ID"><span>{{attr.id}}</span></el-form-item>
          <el-form-item label="只读"><code>{{attr.readonly}}</code></el-form-item>
          <el-form-item label="必填"><code>{{attr.required}}</code></el-form-item>
          <el-form-item label="唯一"><code>{{attr.unique}}</code></el-form-item>
          <el-form-item label="类型"><span>{{attr.value.type}}</span></el-form-item>
        </el-form>
        <el-checkbox slot="reference" :label="attr" :key="attr.id" :value="attr">{{`${attr.name}（${attr.value.type}）`}}</el-checkbox>
      </el-popover>
    </el-checkbox-group>
    <!-- <el-table
      ref="multipleTable"
      :data="currentList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="属性名称">
      </el-table-column>
      <el-table-column
        label="类型">
        <template scope="scope">{{ scope.row.value.type }}</template>
      </el-table-column>
      <el-table-column
        label="只读">
        <template scope="scope">{{ scope.row.readonly ? '只读' : '' }}</template>
      </el-table-column>
      <el-table-column
        label="必填">
        <template scope="scope">{{ scope.row.required ? '必填' : '' }}</template>
      </el-table-column>
      <el-table-column
        label="唯一">
        <template scope="scope">{{ scope.row.unique ? '唯一' : '' }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="select-pagination"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="selectedPreset.attrList.length">
    </el-pagination> -->
    <div class="dialog-footer" slot="footer">
      <el-button @click="onSubmit" type="primary" icon="check">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      selectedPreset: Object,
      currentFields: Array,
      category: {
        default: '',
        type: String
      }
    },
    // created () {
    //   this.handleCurrentChange(1)
    // },

    data () {
      return {
        checkedPresetIds: [],
        checkedAttributes: [],
        currentList: [],
        currentPage: 1
      }
    },

    methods: {
      handleCurrentChange (val) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * 10
        const array = this.selectedPreset.attrList
        this.currentList = (offset + 10 >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + 10)
      },
      // isSelectable (row, index) {
      //   return !['FK', 'FKs'].includes(row.value.type)
      // },
      handleSelectionChange (val) {
        this.checkedAttributes = val
      },
      onSubmit () {
        // 简陋的方法
        // 若 checkbox 可绑定对象，则不必如此
        // for (let attr in this.selectedPreset.attrList) {
        //   if (this.checkedPresetIds.includes(attr.id)) this.checkedAttributes.push(attr)
        // }
        // this.selectedPreset.confVisible = false
        if (this.category) {
          this.checkedAttributes.forEach((_) => { _.category = this.category })
        }
        console.log(this.checkedAttributes)
        this.$parent.$options.methods.importPreset(JSON.parse(JSON.stringify(this.checkedAttributes)), this.currentFields)
        this.selectedPreset.confVisible = false
      }
    }
  }
</script>
