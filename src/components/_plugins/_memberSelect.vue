<template>
  <div>
    <!-- 分组 -->
    <div v-if="strucData.isAlias">
        <!-- @change="groupChange" -->
      <el-select
        v-model="member.group"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        placeholder="请选择">
        <el-option
          v-for="item in (groupList || [])"
          :key="item.key"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-select
        v-model="member.user"
        :clearable="!strucData.required"
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        @change="userChange"
        placeholder="请选择">
        <el-option
          v-for="item in userList"
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
        member: {
          group: null,
          user: null
        },
        memberBuffer: '',
        userId: '',
        userList: [],
        groupList: []
      }
    },
    created () {
      if (this.strucData.isAlias) {
        this.renderGroupList()
        // this.renderGroupUserList()
      } else {
        this.renderUserList()
      }
    },
    watch: {
      'member.group': 'groupChange'
    },
    methods: {
      groupChange (val) {
        if (val.key) {
          this.vmodel[this.strucData.id].group = {}
          this.vmodel[this.strucData.id].group.name = val.name
          this.vmodel[this.strucData.id].group.key = val.key
          this.renderGroupUserList(val.key)
        } else {
          this.vmodel[this.strucData.id].group = null
          this.userList = []
        }
        this.member.user = null
      },
      userChange (val) {
        if (val && val.userId === '未指定') {
          this.vmodel[this.strucData.id].user = null
        } else if (val && val.userId) {
          this.vmodel[this.strucData.id].user = val
        } else {
          this.vmodel[this.strucData.id].user = null
        }
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
          // console.log(response)
          this.groupList = response.data.data
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
      },
      renderGroupUserList (key) {
        const postHeadvData = {
          action: 'users/with/group',
          method: 'GET',
          data: {
            group_key: key
          }
        }
        this.http.post('', this.parseData(postHeadvData))
        .then((response) => {
          // console.log(response)
          this.userList = response.data.data
          if (!this.userList.some(user => { return user.userId === '未指定' })) {
            this.userList.push({userId: '未指定'})
            this.userList.reverse()
          }
          setTimeout(() => {
            if (this.vmodel[this.strucData.id].user && this.vmodel[this.strucData.id].user.userId) {
              this.userList.map(user => {
                if (user.userId === this.vmodel[this.strucData.id].user.userId) {
                  this.member.user = user
                  // console.log(this.vmodel[this.strucData.id].user)
                }
              })
            }
          }, 100)
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
          // console.log(response)
          this.userList = response.data.data
        })
      }
    }
  }
</script>
