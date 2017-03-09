<style lang="less">
  .option-btn {
    margin: 20px 0 6px;
  }
</style>

<template>
  <div class="list-content">
    <el-row class="option-btn">
      <el-button icon="plus" @click="newTaskBtn">新建</el-button>
    </el-row>
    <el-table :data="$store.state.formConfigList">
      <el-table-column label="流程步骤">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.formName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="modifyBtn(scope.row.id)">修改</el-button>
          <el-button size="small" icon="delete" type="danger" @click="delBtn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { DEL_CONF } from '../../../store/mutation-types'

export default {
  data () {
    return {}
  },
  activated () {
    console.log('假装在 拉取 服务器 数据')
  },
  methods: {
    newTaskBtn () {
      this.$router.push('/part1/editor')
    },
    modifyBtn (id) {
      this.$router.push({ path: '/part1/editor', query: { id } })
    },
    delBtn (id) {
      this.$store.commit(DEL_CONF, id)
    }
  }
}
</script>
