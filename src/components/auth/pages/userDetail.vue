  <template>
  <div class="users wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <div class="flex-box">
          <h3 class="module-title">{{ userDetail.userId }}</h3>
          <div class="btn-block">
            <el-button :type="userDetail.status === '1' ? 'success' : 'danger'" size="small" @click="onToggleUser(userDetail)">{{ userDetail.status === '1' ? '启用' : '禁用' }}</el-button>
          </div>
        </div>
        <el-row>
          <el-col :sm="24" :md="18" :lg="12">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="userInfo">
                <el-form :rules="userRules" ref="userRules" :model="userDetail" label-width="78px">
                  <el-form-item label="用户 ID" prop="userId">
                    <el-input v-model="userDetail.userId" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="昵称" prop="nick">
                    <el-input v-model="userDetail.nick"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userDetail.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="phone">
                    <el-input v-model="userDetail.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="使用状态" prop="status">
                    <el-select v-model="userDetail.status" disabled>
                      <el-option label="使用中" value="0"></el-option>
                      <el-option label="已禁用" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-button @click="updateUserInfo({ userId: userDetail.userId, nick: userDetail.nick, email: userDetail.email, phone: userDetail.phone })" type="info">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-tab-pane>
              <!-- 鉴定权限为超级管理理员 -->
              <el-tab-pane label="修改密码" name="setPassword" :disabled="$store.state.userinfo.level !== 0">
                <el-form :rules="userPassRules" ref="userDetail" :model="userDetail" label-width="78px">
                  <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userDetail.password" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="userDetail.checkPass" auto-complete="off"></el-input>
                  </el-form-item>
                  </el-form-item>
                </el-form>
                <el-button @click="updateUserInfo({ userId: userDetail.userId, password: userDetail.password })" type="info">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-tab-pane>
              <!-- 不能修改自己的用户层级和角色 -->
              <el-tab-pane label="修改角色" name="setRole">
                <el-form label-width="78px">
                  <el-form-item label="用户层级" prop="level">
                    <!-- 仅超级管理理员可配置⽤用户层级 -->
                    <el-select v-model="userDetail.level" placeholder="请选择用户层级" :disabled="userDetail.userId === $store.state.userinfo.userId || $store.state.userinfo.level !== 0">
                      <el-option label="超级管理员" value="0" style="display:none"></el-option>
                      <el-option label="管理员" value="1"></el-option>
                      <el-option label="普通" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属角色" prop="groups">
                    <!-- 仅管理理员/超级管理理员可配置 -->
                    <el-checkbox-group v-model="userDetail.groups_key">
                      <el-checkbox
                        :ref="role.key"
                        @change="setGroup"
                        v-for="role in permittedRoleList"
                        :label="role.key"
                        :key="role.key"
                        :disabled="userDetail.userId === $store.state.userinfo.userId || $store.state.userinfo.level > 1">
                        {{role.name}}
                     </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
                <el-button :disabled="userDetail.userId === $store.state.userinfo.userId" @click="updateUserInfo({ userId: userDetail.userId, level: userDetail.level, groups: userDetail.groups_key })" type="info">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'

  export default {
    mixins: [getPermittedRoleList],

    data () {
      var validatePass = (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9_!@#$%^&*]{6,16}$/
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入6至16位符合规则的密码'))
        } else {
          if (this.userDetail.checkPass !== '') {
            this.$refs['userDetail'].validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userDetail.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userDetail: {
          status: ''
        },
        activeTab: 'userInfo',
        userPassRules: {
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        userRules: {
          nick: [
            { required: false, message: '昵称不能为空', trigger: 'blur' }
          ],
          email: [
            { type: 'email', required: false, message: '邮箱不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    computed: {
    },

    created () {
      this.getPermittedRoleList()
      this.renderUserDetail()
    },

    methods: {
      deleteGroup () {
        let arr = this.permittedRoleList.map((val) => {
          return val.key
        })
        console.log(arr)
      },
      setGroup () {
        console.log(this.$refs[role.key])
      },
      renderUserDetail () {
        let postData = {
          action: 'user/info',
          method: 'get',
          data: { userId: this.$route.query.userId }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userDetail = res.data.data
            this.userDetail.level = this.userDetail.level + ''
            this.userDetail.status = this.userDetail.status + ''
            this.$set(this.userDetail, 'groups_key', [])
            this.userDetail.groups.map(group => {
              this.userDetail.groups_key.push(group.key)
            })
          }
        })
      },
      onToggleUser ({ nick, userId, status }) {
        this.$confirm(`确定${status ? '禁用' : '启用'}用户 ${nick} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          status = status === '0' ? 1 : 0
          let postData = {
            action: 'user',
            method: 'put',
            data: { userId, status }
          }
          this.http.post('/user/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已${status ? '禁用' : '启用'}用户「${nick}」！`)
              this.renderUserDetail()
            }
          })
        })
      },
      updateUserInfo (data) {
        if (data.email !== undefined && data.email === '') {
          this.$message.error('邮箱不能为空')
        }
        let postData = {
          action: 'user',
          method: 'put',
          data: data
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success(`已成功修改用户「${data.userId}」的相关信息！`)
            this.$route.push('/auth/users')
            this.renderUserDetail()
          }
        })
      },
      cancel () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .flex-box {
    padding-bottom: 8px;
    .module-title {
      margin-bottom: 0;
    }
    align-items: center;
    border-bottom: 2px solid #ccc;
  }
</style>
