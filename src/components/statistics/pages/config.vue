<style lang="less" scoped>
  .search-box {
    display: flex;

    .el-input {
      width: 210px;
      margin-right: 10px;
    }

    .el-select {
      width: 140px;
    }
  }
</style>

<template>
  <div class="wrapper">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-circle-o icon-lg"></i> 环节权限管理</h3>
            <div class="search-box">
              <el-input
                placeholder="流程名称"
                icon="search"
                size="small"
                v-model="search.pname"
                @change="onSearch"></el-input>
              <el-select v-model="search.category">
                <el-option
                  v-for="item in categoryList"
                  :key="item.key"
                  :label="item.name"
                  :value="item.name"
                  ></el-option>
              </el-select>
            </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import { map } from 'lodash/map'
  // import { uniqBy } from 'lodash/uniqBy'
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'

  export default {
    mixins: [getPermittedProcessList],

    data () {
      return {
        pagination: {
          currentPage: 1,
          pageSize: 10,
          currentList: []
        },
        search: {
          pname: '',
          category: ''
        },
        categoryList: []
      }
    },

    mounted () {
      this.getCategoryList()
      this.getPermittedProcessList()
    },

    methods: {
      getCategoryList () {
        let postData = {
          action: 'process/category',
          method: 'GET',
          data: {
            include_pds: false,
            pd_detail: false
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.categoryList = res.data.data.list
          }
        })
      }
    }
  }
</script>