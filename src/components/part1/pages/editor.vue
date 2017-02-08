<template>
  <div class="editor-content">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-row>
      <el-col :span="2">
        <el-checkbox>必填</el-checkbox>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入参数名"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入初始值"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入说明文本"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="delete"></el-button>
      </el-col>
    </el-row>
    <el-dropdown trigger="click">
      <el-button>新增参数<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>文本输入</el-dropdown-item>
        <el-dropdown-item>数字输入</el-dropdown-item>
        <el-dropdown-item>日期输入</el-dropdown-item>
        <el-dropdown-item>单选</el-dropdown-item>
        <el-dropdown-item>下拉单选</el-dropdown-item>
        <el-dropdown-item>多选</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formConf: []
    }
  },
  methods: {
    addBtn () {
      // 添加表单项
    }
  }
}
</script>