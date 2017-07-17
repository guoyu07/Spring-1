<template>
  <div>
    <!-- hello cascaders -->
    <!-- <el-cascader
      :options="strucData.value.regex"
      v-model="select"
      @change="handleChange">
    </el-cascader> -->
    <el-select v-model="selectValue[0]" placeholder="请选择">
      <el-option
        v-for="item in strucData.value.regex"
        :key="item.value"
        :label="item.label"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-model="selectValue[1]" placeholder="请选择">
      <el-option
        v-for="item in (selectValue[0] && selectValue[0].items || [])"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    props: {
      vmodel: { type: Object },
      whole: { type: Object },
      message: { type: Object },
      strucData: { type: Object },
      index: { type: Number },
      tableIndex: { type: Number },
      bodyTable: { type: Boolean },
      headerTable: { type: Boolean }
    },
    data () {
      return {
        selectValue: []
      }
    },
    created () {
    },
    watch: {
      // 'member.group': 'groupChange'
    },
    methods: {
      renderGroupList () {
        const postHeadvData = {
          action: 'groups/all',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postHeadvData))
        .then((response) => {
          // console.log(response)
          this.groupList = response.data.data
          // console.log(this.vmodel[this.strucData.id])
          if (this.vmodel[this.strucData.id].group && this.vmodel[this.strucData.id].group.key) {
            this.groupList.map(group => {
              console.log(group.key === this.vmodel[this.strucData.id].group.key)
              if (group.key === this.vmodel[this.strucData.id].group.key) {
                this.member.group = group // 这里发生了change事件 导致 user = null
                // console.log(this.vmodel[this.strucData.id])
                // setTimeout(() => {
                //   if (this.userId) {
                //     this.group.users.map(user => {
                //       if (user.userId === this.userId) {
                //         this.vmodel[this.strucData.id].user = user
                //         console.log(this.vmodel[this.strucData.id].user)
                //       }
                //     })
                //   }
                // }, 100)
              }
            })
          }
        })
      }
    }
  }
</script>
