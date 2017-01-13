<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="日期">
      <el-input v-model="date" type="date"></el-input>
    </el-form-item>
    <el-form-item label="时间">
      <el-input v-model="totalTime" type="number" placeholder="请输入时间"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="comment" placeholder="请输入内容"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save()">保存</el-button>
      <router-link to="/time-entries"><el-button>取消</el-button></router-link>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'LogTime',
    data () {
      return {
        date: '',
        totalTime: '',
        comment: ''
      }
    },
    methods: {
      save () {
        const plan = {
          name: '二哲',
          image: 'https://sfault-avatar.b0.upaiyun.com/888/223/888223038-5646dbc28d530_huge256',
          date: this.date,
          totalTime: this.totalTime,
          comment: this.comment
        }
        this.$store.dispatch('savePlan', plan)
        this.$store.dispatch('addTotalTime', this.totalTime)
        this.$router.go(-1)
      }
    }
  }
</script>
