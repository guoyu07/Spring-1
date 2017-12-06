<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");
  .search-box {
    display: flex;

    .el-input {
      width: 210px;
      height: 36px;
      margin-right: 10px;
    }

    .el-select {
      width: 140px;
      margin-right: 10px;
    }
  }
  .el-icon-edit.align {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 16px;
  }
</style>

<template>
  <div class="processes wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-circle-o icon-lg"></i> 环节权限管理</h3>
          <div class="flex-box">
            <div class="search-box">
              <el-input
                    placeholder="流程名称"
                    icon="search"
                    size="small"
                    v-model="search.pname"
                    @change="onSearch">
              </el-input>
              <el-select v-model="search.category" size="small" @change="onSearch" clearable placeholder="流程分类">
                <el-option
                  v-for="item in categoryList"
                  :key="item.key"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>     
            </div>
          </div>
          <el-table :data="currentPageList" border >
            <el-table-column type="expand">
              <template scope="props">
                <el-row>
                  <el-col :sm="24" :md="24" :lg="16">
                    <el-table :data="props.row.task_list" >
                      <el-table-column label="环节名称" prop="tname"></el-table-column>
                      <el-table-column label="标准工时配置" inline-template>
                        <template>
                          <div >
                          <el-input v-if="row.editingTime"  v-model="row.standard_duration">
                          </el-input>
                          <i v-show="row.editingTime" class="el-icon-check text-success" @click="onEdit(row)"></i>
                          <i v-show="row.editingTime" class="el-icon-close text-error" @click="onCancelEdit(row)"></i>
                          <span v-show="!row.editingTime">{{row.standard_duration}} </span>
                          <i class="el-icon-edit align text-info fr" v-if="!row.editingTime" @click="showContainer(row)"></i>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="可管理的流程" prop="pname"></el-table-column>
            <el-table-column label="流程分类" prop="category"></el-table-column>
          </el-table>
          <el-pagination
            class="fr margin-top margin-bottom"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="+currentPageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalPage">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'

  export default {
    mixins: [getPermittedProcessList],

    data () {
      return {
        dialogVisible: false,
        totalPage: 0,
        currentPage: 1,
        currentPageSize: 10,
        currentPageList: [],
        processSearchList: '',
        processList: '',
        search: { pname: '', category: '' },
        categoryList: []
      }
    },
    watch: {
      'permittedProcessList': 'renderList'
    },
    created () {
      this.getCategoryList(false, false)
      this.getPermittedProcessList()
    },
    computed: {

      isQualified () {
        return (this.$store.state.userinfo.superadmin === true)
      }
    },
    methods: {
      onCancelEdit (row) {
        row.standard_duration = row.tempTime
        row.editingTime = false
      },
      onEdit (row) {
        let durationTime
        console.log(row)
        durationTime = row.standard_duration
        let postData = {
          action: 'process/task',
          method: 'put',
          data: {
            pkey: row.pkey,
            tkey: row.tkey,
            standard_duration: durationTime
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            console.log(res.data.data)
            row.editingTime = false
          }
        })
      },
      // 展开选择框
      showContainer (row, users, groups, assign) {
        row.editingTime = true
        row.tempTime = row.standard_duration
        console.log(row)
      },
      onSearch () {
        this.processSearchList = this.permittedProcessList.filter(processe => {
          for (const id in processe) {
            if (['pname'].includes(id)) {
              console.log(processe[id])
              console.log(this.search.pname)
              if (processe[id].includes(this.search.pname)) {
                return true
              }
            }
          }
        })
        .filter(val => {
          for (let id in val) {
            if (id === 'category') {
              if (val[id] === this.search.category || this.search.category === '') {
                return true
              }
            }
          }
        })
        this.totalPage = this.processSearchList.length
        this.handleCurrentChange(1)
      },
      renderList (newVal, oldVal) {
        this.totalPage = newVal.length
        this.handleCurrentChange(1)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * this.currentPageSize
        let array = (this.search.pname || this.search.category) ? this.processSearchList : this.permittedProcessList
        console.log(offset + this.currentPageSize)
        console.log(array)
        this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        this.currentPageSize = val
        this.handleCurrentChange(1)
      },
      getCategoryList (includePds, pdDetail) {
        let postData = {
          action: 'process/category',
          method: 'GET',
          data: {
            include_pds: includePds,
            pd_detail: pdDetail
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            console.log(res.data.data)
            this.categoryList = res.data.data.list
          }
        })
      }
    }
  }
</script>
