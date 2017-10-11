<template>
  <!-- <el-select class="fw" v-model="selectedColumns" value-key="label" multiple>
    <el-option
      v-for="col in columnList"
      :label="col.label"
      :value="col"></el-option>
  </el-select> -->
  <div class="column-conf">
    <draggable v-model="selectedColumns" :move="checkDrag">
      <el-tag
        v-for="col in selectedColumns"
        :key="col.label"
        :closable="true"
        type="gray"
        @close="onRemoveColumn(col)">
        {{col.label}}
      </el-tag>
    </draggable>

    <el-popover
      ref="popover"
      placement="bottom"
      width="150"
      trigger="click">
      <el-checkbox-group class="flex-checkboxes" v-model="selectedColumnLabels" @change="onColumnChange">
        <el-input
          placeholder="搜索"
          icon="search"
          size="small"
          v-model="searchLabel"></el-input>
        <el-checkbox
          v-for="col in filteredList"
          :label="col.label"
          :key="col.label"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
    <el-button v-popover:popover size="small" type="text" icon="fa-caret-down">更多</el-button>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    props: {
      columns: Array
    },

    data () {
      return {
        columnList: [],
        selectedColumns: [],
        selectedColumnLabels: [],
        searchLabel: '',
        prompted: false
      }
    },

    computed: {
      filteredList () {
        // this.filterList.forEach((_) => {
        //   console.log(_.label.indexOf(this.searchLabel))
        // })
        // if (!this.searchLabel.trim()) return
        return this.columnList.filter(_ => _.label.indexOf(this.searchLabel.trim()) >= 0)
      }
    },

    watch: {
      selectedColumns (val) {
        this.$emit('on-column-change', { show: val })
      }
    },

    created () {
      this.getColumnList()
    },

    methods: {
      getColumnList () {
        let postData = {
          action: 'filter/show/fields',
          method: 'GET',
          data: {}
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.columnList = res.data.data.list
            this.$nextTick(() => {
              this.selectedColumns = this.columns
              this.selectedColumnLabels = this.selectedColumns.map(_ => _.label)
            })
          }
        })
      },

      onRemoveColumn (col) {
        this.selectedColumns = this.selectedColumns.filter(_ => _.label !== col.label)
        this.selectedColumnLabels = this.selectedColumnLabels.filter(_ => _ !== col.label)
      },

      onColumnChange (list) {
        let columnBuffer = []
        for (let item of list) {
          columnBuffer.push(this.columnList.find(_ => _.label === item))
        }
        this.selectedColumns = columnBuffer
      },

      checkDrag (e) {
        if (e.draggedContext.element.label === '流程单号') {
          if (!this.prompted) {
            this.$message.warning('流程单号只能是第一列，无法拖动 :(')
          }
          this.prompted = true
          return false
        }
      }
    },

    components: {
      draggable
    }
  }
</script>

<style lang="less">
  .column-conf {
    .el-tag {

      &:first-child {
        i {
          display: none;
        }
      }
      
      &:not(:first-child):hover {
        cursor: move;
        transform: translateY(-2px);
      }

      & + .el-tag {
        margin-left: 6px;
      }
    }
  }
</style>