<template>
  <div class="editor-content">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-row v-for="(item, index) of formConf">
      <el-col :span="2">
        <el-checkbox v-model="item.required">必填</el-checkbox>
      </el-col>
      <el-col :span="4">
        <el-input v-model="item.label" placeholder="请输入标签"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="item.name" placeholder="请输入提交字段名"></el-input>
      </el-col>
      <el-col :span="4" v-if="item.type === 'text'">
        <el-input v-model="item.value" placeholder="请输入初始值"></el-input>
      </el-col>
      <el-col :span="4" v-if="item.type === 'number'">
        <el-input-number v-model="item.value"></el-input-number>
      </el-col>
      <el-col :span="4">
        <el-input v-model="item.description" placeholder="请输入说明文本"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="delete" @click="delBtn(index)"></el-button>
      </el-col>
    </el-row>
    <el-dropdown trigger="click" @command="addBtn">
      <el-button>新增参数<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="text">文本输入</el-dropdown-item>
        <el-dropdown-item command="number">数字输入</el-dropdown-item>
        <el-dropdown-item command="data">日期输入</el-dropdown-item>
        <el-dropdown-item command="radiobox">单选</el-dropdown-item>
        <el-dropdown-item command="select">下拉单选</el-dropdown-item>
        <el-dropdown-item command="checkbox">多选</el-dropdown-item>
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
    addBtn (cmd) {
      // 添加表单项
      switch (cmd) {
        case 'text':
          this.formConf.push({
            type: 'text',
            required: false,
            label: '',
            name: '',
            description: '',
            value: ''
          })
          break
        case 'number':
          this.formConf.push({
            type: 'number',
            required: true,
            label: '',
            name: '',
            description: '',
            value: 0
          })
          break
        default:
          console.log('none')
      }
    },
    delBtn (index) {
      this.formConf.splice(index, 1)
    }
  }
}
</script>
