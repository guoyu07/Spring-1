<template>
  <div>
    <!-- 分组 -->
    <div v-if="strucData.isAlias">
      <el-select
        v-model="group"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        @change="groupChange"
        placeholder="请选择">
        <el-option
          v-for="item in groupList"
          :key="item.key"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-select
        v-model="vmodel[strucData.id].user"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        placeholder="请选择">
        <el-option
          v-for="item in ((group && group.users) || [])"
          :key="item.code"
          :label="item.userId"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <!-- 不分组 -->
    <div v-else>
      <el-select
        v-model="vmodel[strucData.id]"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        class="member"
        placeholder="请选择">
        <!-- <el-tooltip
          effect="dark"
          :content="item.email"
          placement="right"> -->
        <el-option
          v-for="item in userList"
          :key="item.code"
          :label="item.userId"
          :value="item">
          <p>{{ item.userId }}</p>
          <p style="color: #8492a6; font-size: 13px">{{ item.email }}</p>
        </el-option>
        <!-- </el-tooltip> -->
      </el-select>
      <el-button @click="assignToMe" :plain="true" type="info">分配给我</el-button>
    </div>
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
        group: null,
        userList: [],
        groupList: []
      }
    },
    created () {
      if (this.strucData.isAlias) {
        this.renderGroupList()
      } else {
        this.renderUserList()
      }
    },
    methods: {
      groupChange (val) {
        if (!val.users.some(user => { return user.userId === '全部' })) {
          val.users.push({userId: '全部'})
          val.users.reverse()
        }
        this.vmodel[this.strucData.id].group = {}
        this.vmodel[this.strucData.id].group.name = val.name
        this.vmodel[this.strucData.id].group.key = val.key
        this.vmodel[this.strucData.id].user = null
      },
      assignToMe () {
        // console.log('分配给我')
        const user = window.localStorage.userName
        this.userList.map(option => {
          if (option.userId === user) {
            // if (Array.isArray(this.vmodel[this.strucData.id])) {
            //   this.vmodel[this.strucData.id].push(option)
            // } else {
            this.vmodel[this.strucData.id] = option
            // }
          }
        })
      },
      renderGroupList () {
        const postHeadvData = {
          action: 'groups/all',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postHeadvData))
        .then((response) => {
          console.log(response)
          this.groupList = response.data.data
        })
      },
      renderUserList () {
        const postHeadvData = {
          action: 'users/all',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postHeadvData))
        .then((response) => {
          console.log(response)
          this.userList = response.data.data
        })
      }
    }
  }
</script>
