<template>
  <div>
    <!-- 分组 -->
    <div v-if="strucData.isAlias">
        <!-- @change="groupChange" -->
      <el-select
        v-model="member.group"
        clearable
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
        clearable
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        remote
        :remote-method="usersFilter"
        @change="userChange"
        placeholder="请选择">
        <el-option
          v-for="item in usersFilterList"
          :key="item.userId"
          :label="item.userId"
          :value="item">
          <p>{{ item.nick }} - {{ item.userId }}</p>
        </el-option>
      </el-select>
      <div class="assign-btn">
        <el-button size="small" @click="assignToMe" type="text">分配给我</el-button>
      </div>
    </div>
    <!-- 不分组 -->
    <div v-else>
      <el-select
        v-model="vmodel[strucData.id]"
        clearable
        :allow-create="strucData.value.allow_create"
        :disabled="strucData.readonly"
        filterable
        remote
        :remote-method="usersFilter"
        class="member"
        placeholder="请选择">
        <el-option
          v-for="item in usersFilterList"
          :key="item.userId"
          :label="item.userId"
          :value="item">
          <p>{{ item.nick }} - {{ item.userId }}</p>
          <p style="color: #8492a6; font-size: 13px">{{ item.email }}</p>
        </el-option>
      </el-select>
      <div class="assign-btn">
        <el-button size="small" @click="assignToMe" type="text">分配给我</el-button>
      </div>
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
        usersFilterList: [],
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
      usersFilter (query) {
        if (query !== '') {
          this.usersFilterList = this.userList.filter(item => {
            return item.userId.includes(query) || item.nick.includes(query)
          })
        } else {
          this.usersFilterList = this.userList
        }
      },
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
        const user = this.$store.state.userinfo.userId
        if (this.strucData.isAlias) {
          this.groupList.map(group => {
            if (group.key === '__None__') { // 我默认分配为 所有 的分组里面
              this.member.group = group
              setTimeout(() => {
                this.userList.map(option => {
                  if (option.userId === user) {
                    this.member.user = option
                  }
                })
              }, 100)
            }
          })
        } else {
          this.userList.map(option => {
            if (option.userId === user) {
              // if (Array.isArray(this.vmodel[this.strucData.id])) {
              //   this.vmodel[this.strucData.id].push(option)
              // } else {
              this.vmodel[this.strucData.id] = option
              // }
            }
          })
        }
      },
      renderGroupList () {
        const postHeadvData = {
          action: 'groups/all/base',
          method: 'GET',
          data: {}
        }
        this.http.post('/base/', this.parseData(postHeadvData))
        .then((response) => {
          // console.log(response)
          this.groupList = response.data.data.list
          setTimeout(() => {
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
          }, 10)
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
        this.http.post('/base/', postHeadvData)
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
          }, 10)
        })
      },
      renderUserList () {
        const postHeadvData = {
          action: 'users/all',
          method: 'GET',
          data: {}
        }
        this.http.post('/base/', this.parseData(postHeadvData))
        .then((response) => {
          // console.log(response)
          this.userList = response.data.data.list
          this.usersFilter('')
        })
      }
    }
  }
</script>
